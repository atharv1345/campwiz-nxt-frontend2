import { useState } from "react";
import { Autocomplete, FormControlLabel, TextField, Typography, Checkbox } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import { t, type TFunction } from "i18next";

dayjs.extend(utc);

// Define the campaign interface since the original import is missing
export interface CampaignCreate {
  name: string;
  language: string;
  startDate: string;
  endDate: string;
  coordinators: string[];
  description: string;
  rules: string;
  isPublic: boolean;
}

// Initial campaign data
const initialCampaignCreate: CampaignCreate = {
  name: '',
  language: 'commons',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  coordinators: [],
  description: '',
  rules: '',
  isPublic: true
};

// Simple UserInput component since the original is missing
const UserInput = ({ 
  value, 
  onChange, 
  label, 
  disabled, 
  sx 
}: { 
  value: string[]; 
  onChange: (value: string[]) => void; 
  label: string; 
  disabled?: boolean; 
  sx?: any;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div style={sx}>
      <TextField
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={disabled}
        fullWidth
        style={{ marginBottom: 8 }}
        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {value.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#e0e0e0',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {item}
            <button
              onClick={() => handleRemove(index)}
              disabled={disabled}
              style={{
                background: 'none',
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CampaignEditForm = ({ 
  campaign, 
  onUpdate, 
  loading = false, 
  disabled = false, 
  disableOnPrivate = false,
  t 
}: {
  campaign: CampaignCreate;
  onUpdate: (updates: Partial<CampaignCreate>) => void;
  loading?: boolean;
  disabled?: boolean;
  disableOnPrivate?: boolean;
  t: TFunction;
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TextField
        label={t('campaign.name')}
        variant="outlined"
        sx={{ mb: 2, width: '100%' }}
        onChange={(e) => onUpdate({ name: e.target.value })}
        value={campaign.name}
        disabled={loading || disabled}
      />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, flexFlow: 'wrap' }}>
        <Autocomplete
          options={[
            'commons'
          ]}
          renderInput={(params) => <TextField {...params} label={t('campaign.wikiProject')} variant="outlined" />}
          sx={{ width: { xs: '100%', sm: '40%' }, mb: 1 }}
          value={campaign.language}
          onChange={(e, value) => onUpdate({ language: value as string })}
          disabled={loading || disabled}
        />
        <DatePicker
          onChange={(date) => onUpdate({ startDate: date?.toISOString() || '' })}
          value={dayjs(campaign.startDate)}
          sx={{ width: { xs: '100%', sm: '27%' }, mb: 1 }}
          label={t('campaign.startDate')}
          disabled={loading || disabled}
          timezone="UTC"
        />
        <DatePicker
          onChange={(date) => onUpdate({ endDate: date?.toISOString() || '' })}
          value={dayjs(campaign.endDate)}
          sx={{ width: { xs: '100%', sm: '27%' }, mb: 1 }}
          label={t('campaign.endDate')}
          disabled={loading || disabled}
          timezone="UTC"
        />
      </div>

      <UserInput
        value={campaign.coordinators}
        onChange={(coordinators) => onUpdate({ coordinators })}
        label={t('campaign.coordinators')}
        disabled={loading || disabled}
        sx={{ mb: 2 }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexFlow: 'wrap' }}>
        <TextField
          label={t('campaign.description')}
          variant="outlined"
          sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
          onChange={(e) => onUpdate({ description: e.target.value })}
          value={campaign.description}
          multiline
          minRows={4}
          disabled={loading || disabled}
        />
        <TextField
          label={t('campaign.rules')}
          variant="outlined"
          sx={{ mb: 1, width: { xs: '100%', sm: '49%' } }}
          onChange={(e) => onUpdate({ rules: e.target.value })}
          value={campaign.rules}
          multiline
          minRows={4}
          disabled={loading || disabled}
        />
      </div>
      <FormControlLabel
        control={
          <Checkbox
            checked={campaign.isPublic}
            onChange={(e) => onUpdate({ isPublic: e.target.checked })}
            disabled={loading || disabled}
          />
        }
        disabled={disableOnPrivate && !campaign.isPublic}
        sx={{ my: 2 }}
        label={
          <Typography variant="body1" color="textSecondary">
            {t('campaign.publicVisibilityDisclaimer')}
          </Typography>
        }
      />
    </LocalizationProvider>
  );
};

export default CampaignEditForm;