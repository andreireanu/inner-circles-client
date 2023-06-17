import React, { useState, useEffect } from 'react';

import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateCampaignModal from './CreateCampaignModal';

import s from './CreatorCampaigns.module.css';
import cn from 'classnames';



const CreatorCampaigns = ({ creator, className }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  return (
    <div className={cn(s.container, className)}>
      <div className={s.buttonContainer}>
        <Button
          className={s.createConpaignButton}
          onClick={() => setOpenModal(true)}
          startIcon={<AddIcon />}
        >
          Create new campaign
        </Button>
        <CreateCampaignModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          campaigns={campaigns}
          setCampaigns={setCampaigns}
        />
      </div>
    </div>
  );
};

export default CreatorCampaigns;
