import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';

const TOKENS = ['eth', 'bnb'];

const PickTokenModal = ({ handleClose, onTokenSelected }: any) => {
  const handleListItemClick = (token: string) => {
    onTokenSelected(token);
    handleClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth>
      <DialogTitle>Choose Token</DialogTitle>
      <List sx={{ pt: 0 }}>
        {TOKENS.map((token) => (
          <ListItem key={token}>
            <ListItemButton
              onClick={() => handleListItemClick(token)}
              key={token}
            >
              {/* <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar> */}
              <ListItemText primary={token.toUpperCase()} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default PickTokenModal;
