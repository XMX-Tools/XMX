import { useCallback } from 'react'
import { ethers } from 'ethers'
import useSWR from 'swr'
import { getBalance } from '@wagmi/core'
import { useAppDispatch } from '../index'
import { useAccount } from 'wagmi'
import { TOKENS } from '../../config/tokens'
import { useTokenBalances } from './hooks'
import { updateTotalBalance } from './actions'
import { wagmiConfig } from '../../providers/Web3'

export const useFetchWalletBalance = async () => {
  const dispatch = useAppDispatch()
  const { address, status, chain } = useAccount()
  const tokenBalances = useTokenBalances()

  const fetchWalletBalance = useCallback(async () => {
    if (!address || status !== 'connected' || !chain || !TOKENS[chain?.id]?.length) {
      return
    }
    const tokenList = TOKENS[chain?.id]
    const balanceList = { ...tokenBalances }

    for (let i = 0; i < tokenList.length; i++) {
      if (tokenList[i]?.address === ethers.ZeroAddress) {
        const getMainTokenBalance = await getBalance(wagmiConfig, { address, unit: 'ether', chainId: chain?.id })
        balanceList['ETH'] = getMainTokenBalance?.formatted ?? '0'
        continue
      }
      const getTokenBalance = await getBalance(wagmiConfig, { address, chainId: chain?.id, unit: 'ether', token: tokenList[i]?.address })
      balanceList[tokenList[i]?.symbol] = getTokenBalance?.formatted ?? '0'
    }
    dispatch(updateTotalBalance({ totalBalances: balanceList }))
    return balanceList
  }, [address, chain, dispatch, status, tokenBalances])

  const { data } = useSWR('fetchWalletBalance', fetchWalletBalance, {
    refreshInterval: 1000,
  })
  return data
}
