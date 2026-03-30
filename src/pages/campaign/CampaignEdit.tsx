import { useState } from "react";
import {
  Autocomplete,
  FormControlLabel,
  TextField,
  Typography,
  Checkbox,
  Box
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import { type TFunction } from "i18next";

dayjs.extend(utc);

// ================== TYPES ==================
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

// ================== USER INPUT COMPONENT ==================
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
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Box sx={sx}>
      <TextField
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={disabled}
        fullWidth
        sx={{ mb: 1 }}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {value.map((item, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "#e0e0e0",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: 0.5
            }}
          >
            {item}
            <button
              onClick={() => handleRemove(index)}
              disabled={disabled}
              style={{
                background: "none",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              ×
            </button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ================== MAIN COMPONENT ==================
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
        label={t("campaign.name")}
        variant="outlined"
        sx={{ mb: 2, width: "100%" }}
        onChange={(e) => onUpdate({ name: e.target.value })}
        value={campaign.name}
        disabled={loading || disabled}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          mb: 2
        }}
      >
        <Autocomplete
          options={["commons"]}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("campaign.wikiProject")}
              variant="outlined"
            />
          )}
          sx={{ width: { xs: "100%", sm: "40%" }, mb: 1 }}
          value={campaign.language}
          onChange={(_, value) =>
            onUpdate({ language: value || "commons" })
          }
          disabled={loading || disabled}
        />

        <DatePicker
          onChange={(date) =>
            onUpdate({ startDate: date?.toISOString() || "" })
          }
          value={dayjs(campaign.startDate)}
          sx={{ width: { xs: "100%", sm: "27%" }, mb: 1 }}
          label={t("campaign.startDate")}
          disabled={loading || disabled}
        />

        <DatePicker
          onChange={(date) =>
            onUpdate({ endDate: date?.toISOString() || "" })
          }
          value={dayjs(campaign.endDate)}
          sx={{ width: { xs: "100%", sm: "27%" }, mb: 1 }}
          label={t("campaign.endDate")}
          disabled={loading || disabled}
        />
      </Box>

      <UserInput
        value={campaign.coordinators}
        onChange={(coordinators) => onUpdate({ coordinators })}
        label={t("campaign.coordinators")}
        disabled={loading || disabled}
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        <TextField
          label={t("campaign.description")}
          variant="outlined"
          sx={{ mb: 1, width: { xs: "100%", sm: "49%" } }}
          onChange={(e) => onUpdate({ description: e.target.value })}
          value={campaign.description}
          multiline
          minRows={4}
          disabled={loading || disabled}
        />

        <TextField
          label={t("campaign.rules")}
          variant="outlined"
          sx={{ mb: 1, width: { xs: "100%", sm: "49%" } }}
          onChange={(e) => onUpdate({ rules: e.target.value })}
          value={campaign.rules}
          multiline
          minRows={4}
          disabled={loading || disabled}
        />
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={campaign.isPublic}
            onChange={(e) =>
              onUpdate({ isPublic: e.target.checked })
            }
            disabled={loading || disabled}
          />
        }
        disabled={disableOnPrivate && !campaign.isPublic}
        sx={{ my: 2 }}
        label={
          <Typography variant="body1" color="textSecondary">
            {t("campaign.publicVisibilityDisclaimer")}
          </Typography>
        }
      />
    </LocalizationProvider>
  );
};

export default CampaignEditForm;