import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import styles from './Reports.module.css';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
function CustomDatePicker({ label, value = '', fieldName }) {
  return (
    <FormControl sx={{ m: 0, width: 150, backgroundColor: 'white' }}>
      <DatePicker
        id={styles.datePicker}
        label={label}
        value={dayjs(value)}
        format="YYYY-MM"
        name={fieldName}
        slots={{ textField: TextField }}
        views={['year', 'month']}
        slotProps={{
          popper: {
            sx: {
              '.MuiPaper-root': {
                border: '1px solid blue',
                borderRadius: '10px',
              },
              '.MuiPickersCalendarHeader-root':{
                minHeight:'auto',
                maxHeight:'max-content',
              },
              '.MuiPickersYear-yearButton, .MuiPickersMonth-monthButton':{
                height:'auto'
              }
            },
          },
          textField: {
            size: 'small',
            sx: {
              margin: 0,
              padding: 0,
              backgroundColor: 'white',
              '& .MuiFormLabel-root': { fontSize: '18px' },
              '& .MuiInputBase-input': { fontSize: '18px' },
              '& .MuiSvgIcon-root': { fontSize: '25px' },
            },
          },
        }}
      />
    </FormControl>
  );
}

export default CustomDatePicker;
