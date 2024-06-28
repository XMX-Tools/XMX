import { Text } from '@chakra-ui/react'
import { useAccount, useConfig, useConnect } from 'wagmi'
import { useTranslation } from 'next-i18next'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { HeadingComponent } from '../../components/Layouts/HeadingComponent'
import { useThemeModeManager } from '../../state/user/hooks'
import { useTokenBalances } from 'state/balances/hooks'
import { TOKENS } from '../../config/tokens'

const Home = () => {
  const { t } = useTranslation()
  const [userThemeMode] = useThemeModeManager()
  const walletBalances = useTokenBalances()
  const { address, chain } = useAccount()
  return (
    <div>
      <main>
        <HeadingComponent as="h2">A quickly start web3 template</HeadingComponent>
        <Text as="b" fontSize="24px">
          {t('Hello world')}
        </Text>
        <Text fontSize="lg">Theme mode: {userThemeMode}</Text>
        <br />
        {address && chain ? (
          <>
            <Text fontSize="lg">Wallet address: {address}</Text>
            <Text fontSize="lg">Wallet Balance: </Text>
            {TOKENS[chain?.id]?.map((token) => {
              return (
                <Text fontSize="lg" key={token.address} color={'gray.500'}>
                  {token.symbol}: {walletBalances[token.symbol]}
                </Text>
              )
            })}
          </>
        ) : (
          <Text fontSize="lg" as="b">
            Login to check your wallet balance
          </Text>
        )}

        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <p>one!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </main>
    </div>
  )

}

export default Home
