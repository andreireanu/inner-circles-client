import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import {
  ContractFunction,
  ResultsParser,
  Address,
  AddressValue,
} from '@multiversx/sdk-core/out';
import { smartContract } from './smartContract';

const resultsParser = new ResultsParser();

export const useGetCreatorToken = ({ address }: any) => {
  const { network } = useGetNetworkConfig();
  const [creatorToken, setCreatorToken] = useState<string>();
  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getCreatorToken = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('getCreatorToken'),
        args: [new AddressValue(new Address(address))]
      });
      const queryResponse = await proxy.queryContract(query);
      const endpointDefinition = smartContract.getEndpoint('getCreatorToken');
      const { firstValue } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );
      setCreatorToken(firstValue?.valueOf());
    } catch (err) {
      console.error('Unable to call getCreatorToken', err);
    }
  };

  useEffect(() => {
    getCreatorToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return creatorToken;
};
