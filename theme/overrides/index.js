import Alert from './Alert';
import Backdrop from './Backdrop';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import Card from './Card';
import CssBaseline from './CssBaseline';
import Dialog from './Dialog';
import Link from './Link';
import LoadingButton from './LoadingButton';
import Paper from './Paper';
import Progress from './Progress';
import Typography from './Typography';

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Card(theme),
    Link(theme),
    Paper(theme),
    Alert(theme),
    Button(theme),
    Dialog(theme),
    Backdrop(theme),
    Progress(theme),
    Typography(theme),
    ButtonGroup(theme),
    CssBaseline(theme),
    LoadingButton(theme)
  );
}
