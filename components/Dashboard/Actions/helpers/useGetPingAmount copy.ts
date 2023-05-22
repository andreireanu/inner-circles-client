import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import { smartContract } from './smartContractOLD';

const resultsParser = new ResultsParser();

export const useGetUserToken = () => {
  const { network } = useGetNetworkConfig();
  const [pingAmount, setPingAmount] = useState<string>();

  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getUserToken = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('getUserToken'),
        args: [new AddressValue(new Address(address))]
      });
      const queryResponse = await proxy.queryContract(query);

      const endpointDefinition = smartContract.getEndpoint('getUserToken');

      const { firstValue: amount } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );

      setPingAmount(amount?.valueOf()?.toString(10));
    } catch (err) {
      console.error('Unable to call getUserToken', err);
    }
  };

  useEffect(() => {
    getUserToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return pingAmount;
};
