import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TextField, Typography } from '@mui/material';
import { BasicFrame } from '../../common/Frame/BasicFrame';
import { MedicalRecommendationResponse } from '../../interfaces/user/user.interface';


interface DialogProps {
  open: boolean;
  data: MedicalRecommendationResponse;
  onClose: () => void;
}

const DialogMedical: React.FC<DialogProps> = ({ open, data, onClose }) => {

    function getSeverityLabel(severity: number): string {
        switch (severity) {
          case 1:
            return "Leve";
          case 2:
            return "Moderado";
          case 3:
            return "Grave";
          case 4:
            return "Muy grave";
          case 5:
            return "Urgente";
          default:
            return "Desconocido";
        }
      }
      
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div style={{padding:'1em', backgroundColor: '#6DC3CC'}} >
            <DialogTitle style={{padding:'15px 24px 5px 24px'}}>
                <Typography style={{ textAlign:'start', fontSize: '0.9em', fontWeight: 'bold', display:'flex', flexDirection:'row', alignItems:'center', }}>
                Especialidad Recomendada
                </Typography>
            </DialogTitle>
            <DialogContent className='flex items-center justify-center' style={{padding:'0 10px', flexDirection: 'column'}}>
                <BasicFrame isCentered={false} className='flex-col justify-start mt-1 mb-1' style={{width:'95%'}}>
                  <TextField
                      type="text"
                      label="Recomendación"
                      margin="normal"
                      disabled
                      value={data.specialty}
                      sx={{marginTop: '1em',}}
                      inputProps={{style: {fontSize: 13, fontWeight:'500'}}} // font size of input text
                      fullWidth
                    /> 
                  </BasicFrame>

                  <BasicFrame isCentered={false} className='flex-col justify-start mt-0 mb-3' style={{width:'95%'}}>
                  <TextField
                      type="text"
                      label="Recomendación"
                      margin="normal"
                      disabled
                      value={getSeverityLabel(data.severity)}
                      sx={{marginTop: '1em',}}
                      inputProps={{style: {fontSize: 13, fontWeight:'500'}}} // font size of input text
                      fullWidth
                    /> 
                  </BasicFrame>
            </DialogContent>
            <DialogActions>
                <BasicFrame isCentered={false} className='justify-center w-full' style={{width:'90%', height:'40px'}}>
                    <Button 
                        onClick={onClose}
                        style={{ 
                            fontSize: '0.8em', 
                            borderRadius: '0.7em', 
                            width: '130px', 
                            textTransform: 'none', 
                            backgroundColor:'#007098', 
                            color:'#fff' 
                        }}>
                        Aceptar
                    </Button>
                </BasicFrame>
            </DialogActions>
        </div>
    </Dialog>
  );
};

export default DialogMedical;