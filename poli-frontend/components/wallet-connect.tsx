'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { useChainId } from 'wagmi'
import { useTokenBalance } from '@/lib/hooks/use-token-balance'
import { getContractAddress, DEFAULT_TOKEN } from '@/lib/contracts/addresses'

export function WalletConnect() {
  const chainId = useChainId()

  // Get USDC balance
  let tokenAddress: `0x${string}` | undefined
  try {
    tokenAddress = getContractAddress(chainId, DEFAULT_TOKEN)
  } catch {
    // Chain not supported, tokenAddress stays undefined
  }

  const { formattedBalance } = useTokenBalance(tokenAddress)

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="w-full"
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="w-full h-14 border-2 border-[#0052FF] bg-white hover:bg-[#0052FF]/5 text-[#0052FF] transition-smooth-fast rounded-lg text-base font-semibold"
                  >
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    className="w-full"
                  >
                    ⚠️ 错误网络
                  </Button>
                )
              }

              return (
                <div className="space-y-2 w-full">
                  {/* Balance display */}
                  {tokenAddress && (
                    <div className="bg-base-gray-50 rounded-lg p-3 border border-base-gray-200">
                      <div className="text-xs text-base-gray-700 mb-1">USDC 余额</div>
                      <div className="text-lg font-bold text-foreground">
                        ${parseFloat(formattedBalance).toFixed(2)}
                      </div>
                    </div>
                  )}

                  {/* Network button */}
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    className="w-full border-base-gray-200 bg-white hover:bg-base-gray-50 transition-smooth-fast justify-start"
                  >
                    {chain.hasIcon && (
                      <div
                        className="mr-2"
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-sm">{chain.name}</span>
                  </Button>

                  {/* Account button */}
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    className="w-full border-base-gray-200 bg-white hover:bg-base-gray-50 transition-smooth-fast font-mono text-sm"
                  >
                    {account.displayName}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

