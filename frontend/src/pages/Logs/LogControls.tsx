import React from "react";
import { Box, TextField, InputAdornment, Paper, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NumbersIcon from "@mui/icons-material/Numbers";
import { useTranslation } from "react-i18next";

interface LogControlsProps {
    tailLines: number;
    onTailLinesChange: (lines: number) => void;
    keyword: string;
    onKeywordChange: (keyword: string) => void;
}

export const LogControls: React.FC<LogControlsProps> = ({
    tailLines,
    onTailLinesChange,
    keyword,
    onKeywordChange,
}) => {
    const { t } = useTranslation();

    return (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={t("filter_logs_placeholder", "Search logs / Filter by keyword...")}
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label={t("tail_lines", "Tail Lines")}
                        value={tailLines}
                        onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value));
                            onTailLinesChange(val);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <NumbersIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};
export default LogControls;
