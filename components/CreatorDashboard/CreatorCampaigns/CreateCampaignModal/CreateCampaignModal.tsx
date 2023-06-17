import React, { FC, useState, SetStateAction, useRef, LegacyRef } from 'react';
import {
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Alert,
  Checkbox,
  Box,
  FormGroup,
  FormControlLabel
} from '@mui/material';

import FormProvider from '../../../FormProvider';
import RHFTextField from '../../../RHFTextField';

import { useForm } from 'react-hook-form';
import s from './CreateCampaignModal.module.css';

import { createCampaign } from '../../../../utils/createCampaign';

export interface CreateCampaignModalProps {
  className?: string;
  open: boolean;
  handleClose: () => void;
  setCampaigns: SetStateAction<any>;
  campaigns: Array<any>;
}

const CreateCampaignModal: FC<CreateCampaignModalProps> = ({
  handleClose,
  open,
}) => {
  const methods = useForm();
  const [error, setError] = useState<string | null>(null);
  // const [name, setName] = useState('');

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    setError(null);
    console.log(data);
    console.log(data.name);
    console.log(data.campaignHashtag);
    console.log(Number(data.tokenQuantity));
    createCampaign(data.name, data.campaignHashtag, data.tokenQuantity); 
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className={s.subContainer}>
          <DialogTitle id='alert-dialog-title'>Create new Campaign</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {error ? <Alert severity='error'>{error}</Alert> : null}
              <FormProvider methods={methods}>
                <RHFTextField
                  name='name'
                  label='Campaign name'
                  variant='standard'
                  required
                />
                <RHFTextField
                  name='campaignHashtag'
                  label='Campaign hashtag'
                  variant='standard'
                  required
                />
                <RHFTextField
                  name='tokenQuantity'
                  label='Allocated tokens'
                  variant='standard'
                  required
                />
              </FormProvider>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit(onSubmit)}>Create</Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

export default CreateCampaignModal;
