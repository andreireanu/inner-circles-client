import React, { useState, useEffect } from 'react';

import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import CompaignsSlider from './CompaignsSlider';
import AddIcon from '@mui/icons-material/Add';
import CreateCompaignModal from './CreateCompaignModal';
import { getCampaignsFromLocalStorage } from '../../../utils/localStorage';

import s from './CreatorCompaigns.module.css';
import cn from 'classnames';

const mock = [
  'campaign1',
  'campaign2',
  'campaign3',
  'campaign4',
  'campaign5',
  'campaign6'
];

const CreatorCompaigns = ({ creator, className }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    (async () => {
      const campaignsTmp = await getCampaignsFromLocalStorage();
      if (campaignsTmp) setCampaigns(campaignsTmp);
    })();
  }, []);

  return (
    <div className={cn(s.container, className)}>
      <div className={s.buttonContainer}>
        <Button
          className={s.createConpaignButton}
          onClick={() => setOpenModal(true)}
          startIcon={<AddIcon />}
        >
          Create new compaign
        </Button>
        <CreateCompaignModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
        />
      </div>
      <CompaignsSlider className={s.compaignsSlider} compaigns={campaigns} />
    </div>
  );
};

export default CreatorCompaigns;
