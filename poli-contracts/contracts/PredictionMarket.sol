// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PredictionMarket
 * @dev A simple prediction market contract for binary outcomes
 */
contract PredictionMarket is Ownable, ReentrancyGuard {
    IERC20 public bettingToken;
    
    struct Market {
        string question;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = YES, false = NO
        uint256 totalYes;
        uint256 totalNo;
        address creator;
    }
    
    struct Position {
        uint256 yesAmount;
        uint256 noAmount;
        bool claimed;
    }
    
    // Market ID => Market
    mapping(uint256 => Market) public markets;
    
    // Market ID => User => Position
    mapping(uint256 => mapping(address => Position)) public positions;
    
    // User => Market IDs
    mapping(address => uint256[]) public userBets;
    
    uint256 public marketCount;
    
    event MarketCreated(uint256 indexed marketId, string question, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed user, bool outcome, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount);
    
    constructor(address _bettingToken) Ownable(msg.sender) {
        bettingToken = IERC20(_bettingToken);
    }
    
    /**
     * @dev Create a new prediction market
     */
    function createMarket(string memory _question, uint256 _endTime) external returns (uint256) {
        require(_endTime > block.timestamp, "End time must be in the future");
        
        uint256 marketId = marketCount++;
        
        markets[marketId] = Market({
            question: _question,
            endTime: _endTime,
            resolved: false,
            outcome: false,
            totalYes: 0,
            totalNo: 0,
            creator: msg.sender
        });
        
        emit MarketCreated(marketId, _question, _endTime);
        return marketId;
    }
    
    /**
     * @dev Place a bet on a market
     */
    function placeBet(uint256 _marketId, bool _outcome, uint256 _amount) external nonReentrant {
        Market storage market = markets[_marketId];
        require(block.timestamp < market.endTime, "Market has ended");
        require(!market.resolved, "Market already resolved");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from user
        require(
            bettingToken.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );
        
        // Update position
        Position storage position = positions[_marketId][msg.sender];
        if (_outcome) {
            position.yesAmount += _amount;
            market.totalYes += _amount;
        } else {
            position.noAmount += _amount;
            market.totalNo += _amount;
        }
        
        // Track user bets
        if (position.yesAmount + position.noAmount == _amount) {
            userBets[msg.sender].push(_marketId);
        }
        
        emit BetPlaced(_marketId, msg.sender, _outcome, _amount);
    }
    
    /**
     * @dev Resolve a market (only owner)
     */
    function resolveMarket(uint256 _marketId, bool _outcome) external onlyOwner {
        Market storage market = markets[_marketId];
        require(block.timestamp >= market.endTime, "Market has not ended");
        require(!market.resolved, "Market already resolved");
        
        market.resolved = true;
        market.outcome = _outcome;
        
        emit MarketResolved(_marketId, _outcome);
    }
    
    /**
     * @dev Claim winnings from a resolved market
     */
    function claimWinnings(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");
        
        Position storage position = positions[_marketId][msg.sender];
        require(!position.claimed, "Already claimed");
        
        uint256 winnings = calculateWinnings(_marketId, msg.sender);
        require(winnings > 0, "No winnings to claim");
        
        position.claimed = true;
        
        require(
            bettingToken.transfer(msg.sender, winnings),
            "Token transfer failed"
        );
        
        emit WinningsClaimed(_marketId, msg.sender, winnings);
    }
    
    /**
     * @dev Calculate potential winnings for a user
     */
    function calculateWinnings(uint256 _marketId, address _user) public view returns (uint256) {
        Market storage market = markets[_marketId];
        if (!market.resolved) return 0;
        
        Position storage position = positions[_marketId][_user];
        if (position.claimed) return 0;
        
        uint256 winningBet = market.outcome ? position.yesAmount : position.noAmount;
        if (winningBet == 0) return 0;
        
        uint256 totalWinning = market.outcome ? market.totalYes : market.totalNo;
        uint256 totalPool = market.totalYes + market.totalNo;
        
        // Winnings = (user's winning bet / total winning bets) * total pool
        return (winningBet * totalPool) / totalWinning;
    }
    
    /**
     * @dev Get market information
     */
    function getMarketInfo(uint256 _marketId) external view returns (
        address creator,
        string memory question,
        uint256 endTime,
        bool resolved,
        bool outcome,
        uint256 totalYes,
        uint256 totalNo
    ) {
        Market storage market = markets[_marketId];
        return (
            market.creator,
            market.question,
            market.endTime,
            market.resolved,
            market.outcome,
            market.totalYes,
            market.totalNo
        );
    }
    
    /**
     * @dev Get user position in a market
     */
    function getUserPosition(uint256 _marketId, address _user) external view returns (
        uint256 yesAmount,
        uint256 noAmount,
        bool claimed
    ) {
        Position storage position = positions[_marketId][_user];
        return (position.yesAmount, position.noAmount, position.claimed);
    }
    
    /**
     * @dev Get all markets a user has bet on
     */
    function getUserBets(address _user) external view returns (uint256[] memory) {
        return userBets[_user];
    }
    
    /**
     * @dev Calculate potential winnings (before resolution)
     */
    function calculatePotentialWinnings(uint256 _marketId, address _user) external view returns (uint256) {
        Market storage market = markets[_marketId];
        Position storage position = positions[_marketId][_user];
        
        if (position.yesAmount == 0 && position.noAmount == 0) return 0;
        
        uint256 totalPool = market.totalYes + market.totalNo;
        if (totalPool == 0) return 0;
        
        // Calculate for YES outcome
        uint256 yesWinnings = 0;
        if (market.totalYes > 0) {
            yesWinnings = (position.yesAmount * totalPool) / market.totalYes;
        }
        
        // Calculate for NO outcome
        uint256 noWinnings = 0;
        if (market.totalNo > 0) {
            noWinnings = (position.noAmount * totalPool) / market.totalNo;
        }
        
        // Return the better outcome
        return yesWinnings > noWinnings ? yesWinnings : noWinnings;
    }
}
