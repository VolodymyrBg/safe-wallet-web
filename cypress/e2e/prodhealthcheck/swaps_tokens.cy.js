import * as constants from '../../support/constants.js'
import * as main from '../pages/main.page.js'
import * as swaps from '../pages/swaps.pages.js'
import * as assets from '../pages/assets.pages.js'
import { getSafes, CATEGORIES } from '../../support/safes/safesHandler.js'
import * as wallet from '../../support/utils/wallet.js'

let staticSafes = []
const walletCredentials = JSON.parse(Cypress.env('CYPRESS_WALLET_CREDENTIALS'))
const signer = walletCredentials.OWNER_4_PRIVATE_KEY

let iframeSelector = `iframe[src*="${constants.swapWidget}"]`

describe('[PROD] Swaps token tests', () => {
  before(async () => {
    staticSafes = await getSafes(CATEGORIES.static)
  })

  beforeEach(() => {
    cy.visit(constants.prodbaseUrl + constants.BALANCE_URL + staticSafes.SEP_STATIC_SAFE_1)
  })

  it.skip(
    'Verify that clicking the swap from assets tab, autofills that token automatically in the form',
    { defaultCommandTimeout: 30000 },
    () => {
      wallet.connectSigner(signer)
      assets.selectTokenList(assets.tokenListOptions.allTokens)

      swaps.clickOnAssetSwapBtn(0)
      swaps.acceptLegalDisclaimer()
      cy.wait(2000)
      main.getIframeBody(iframeSelector).within(() => {
        swaps.verifySelectedInputCurrancy(swaps.swapTokens.eth)
      })
    },
  )

  // TODO: Check why expected number of buttons not displayed sometimes
  it.skip('Verify swap button are displayed in assets table and dashboard', () => {
    assets.selectTokenList(assets.tokenListOptions.allTokens)
    main.verifyElementsCount(swaps.assetsSwapBtn, 4)
    cy.visit(constants.homeUrl + staticSafes.SEP_STATIC_SAFE_1)
    main.verifyElementsCount(swaps.assetsSwapBtn, 4)
    main.verifyElementsCount(swaps.dashboardSwapBtn, 1)
  })
})
