import OutlinedInput from '@mui/material/OutlinedInput';  
import InputLabel from '@mui/material/InputLabel';  
import MenuItem from '@mui/material/MenuItem';  
import FormControl from '@mui/material/FormControl';  
import ListItemText from '@mui/material/ListItemText';  
import Select from '@mui/material/Select';  
import Checkbox from '@mui/material/Checkbox';  
import { useState, useEffect } from 'react';  
import styles from './Reports.module.css';  

const ITEM_HEIGHT = 100;  
const ITEM_PADDING_TOP = 8;  
const MenuProps = {  
  PaperProps: {  
    style: {  
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,  
      width: 300,  
    },  
    sx:{
      '& .MuiTypography-root': { fontSize: '18px' },
      '& .PrivateSwitchBase-input': { fontSize: '18px' },
      '& .MuiSvgIcon-root': {  
              fontSize: 28, 
            }, 
    }
  },  
};  

export default function MultipleSelectCheckmarks({  
  options,  
  itemName,  
  fieldName,  
  actionSelectedValues, // New prop for action selected values  
  onChange, // Prop to handle changes  
}) {  
  const [selectedValues, setSelectedValues] = useState([]);  

  useEffect(() => {  

    if (actionSelectedValues.length !== 0) {  
      setSelectedValues(actionSelectedValues);  
    } else {  
      setSelectedValues(options.map((option) => option.id));  
    }  
  }, [options, actionSelectedValues]);  

  const handleChange = (event) => {  
    const {  
      target: { value },  
    } = event;  
    const newSelectedValues = typeof value === 'string' ? value.split(',') : value;  
    setSelectedValues(newSelectedValues);  
    onChange(newSelectedValues); 
  };  

  const renderValue = () => {  
    if (selectedValues.length === 0) {  
      return `No ${itemName} Selected`;  
    } else if (selectedValues.length === options.length) {  
      return `All ${itemName}`;  
    }  
    return `${selectedValues.length} Selected ${itemName}`;  
  };  

  return (  
    <FormControl  
      sx={{  
        m: 0,  
        width: 300,  
        height: 43,  
        backgroundColor: 'white',  
      }}  
    >  
      <InputLabel shrink={true} id={styles.multipleCheckboxLabel}>  
        Select {itemName}  
      </InputLabel>  
      <Select  
        size="small"  
        labelId={styles.multipleCheckboxLabel}  
        id={styles.multipleCheckbox}  
        multiple  
        name={fieldName}  
        value={selectedValues}  
        onChange={handleChange}  
        input={<OutlinedInput label={`Select ${itemName}`} />}  
        renderValue={renderValue}  
        MenuProps={MenuProps}  
      >  
        {options.map((option) => (  
          <MenuItem key={option.id} value={option.id}>  
            <Checkbox checked={selectedValues.includes(option.id)} />  
            <ListItemText primary={option.value} />  
          </MenuItem>  
        ))}  
      </Select>  
    </FormControl>  
  );  
}