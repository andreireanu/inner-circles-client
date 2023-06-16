import React, { useState, useEffect } from 'react';

import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import CompaignsSlider from './CompaignsSlider';
import AddIcon from '@mui/icons-material/Add';
import CreateCompaignModal from './CreateCompaignModal';

import s from './CreatorCompaigns.module.css';
import cn from 'classnames';



const CreatorCompaigns = ({ creator, className }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [campaigns, setCompaigns] = useState([]);



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
        <CreateCompaignModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          campaigns={campaigns}
          setCompaigns={setCompaigns}
        />
      </div>
      <CompaignsSlider className={s.compaignsSlider} compaigns={campaigns} />
    </div>
  );
};

export default CreatorCompaigns;
