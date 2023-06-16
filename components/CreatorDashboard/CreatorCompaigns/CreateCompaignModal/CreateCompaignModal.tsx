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
import MockCreateCampaign from './MockCreateCampaign';

import { useForm } from 'react-hook-form';

import cn from 'classnames';
import s from './CreateCompaignModal.module.css';

export interface CreateCompaignModalProps {
  className?: string;
  open: boolean;
  handleClose: () => void;
  setCompaigns: SetStateAction<any>;
  campaigns: Array<any>;
}



const CreateCompaignModal: FC<CreateCompaignModalProps> = ({
  className,
  handleClose,
  open,
  campaigns,
  setCompaigns
}) => {
  const methods = useForm();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<string>('');
  // const [name, setName] = useState('');

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    setError(null);
    console.log({ ...data, platform });
    const res = MockCreateCampaign({ ...data, platform });
    if (res.succeed) {
      // Store un localstorage for mocking
      const newCompaigns = campaigns;
      newCompaigns.push({ ...data, platform });
      setCompaigns(newCompaigns);
      handleClose();
    } else {
      setError(res?.message || 'An error occured please try again');
    }
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
          <DialogTitle id='alert-dialog-title'>Create new Compaign</DialogTitle>
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
                  name='compaignLink'
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

export default CreateCompaignModal;
