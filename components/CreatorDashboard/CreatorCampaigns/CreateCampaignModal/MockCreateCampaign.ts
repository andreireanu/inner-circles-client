interface MockCreateCampaignResponse {
  succeed: boolean;
  message: string;
}

export const MockCreateCampaign = ({
  name,
  platform,
  compaignLink,
  tokenQuantity
}: any): MockCreateCampaignResponse => {
  // This is a mock to create a campaign

  console.log(name, platform, compaignLink, tokenQuantity);

  if (!name || !platform || !compaignLink || !tokenQuantity)
    return {
      succeed: false,
      message:
        'The name, platform, compaignLink and tokenQuantity fields are mandatory'
    };

  if (name === 'test')
    return {
      succeed: false,
      message: 'This name is already use'
    };

  return {
    succeed: true,
    message: 'Creator was created'
  };
};

export default MockCreateCampaign;
