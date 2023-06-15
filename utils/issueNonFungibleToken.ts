import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';
import { stringToHex } from './toHex';

export const issueNonFungibleToken = async (
    tokenName: string,
    tokenSymbol: string,
) => {

    console.log(tokenName);
    console.log(tokenSymbol);

    const transaction = {
        value: 50000000000000000,
        data: `issueSemiFungibleToken@${stringToHex(tokenName)}@${stringToHex(tokenSymbol)}`,
        receiver: contractAddress,
        gasLimit: '140000000'
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
        transactions: transaction,
        transactionsDisplayInfo: {
            processingMessage: 'Processing Transaction',
            errorMessage: 'An error has occured during transaction',
            successMessage: 'Transaction successful'
        },
        redirectAfterSign: false
    });
    return sessionId;

};