import React from "react";
import { Box, Button, ButtonGroup, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

const COMPONENTS = [
    { id: "volcano-scheduler", label: "Scheduler" },
    { id: "volcano-controller-manager", label: "Controller Manager" },
    { id: "volcano-webhook-manager", label: "Webhook Manager" },
    { id: "volcano-agent", label: "Agent" },
];

interface ComponentSelectorProps {
    selected: string;
    onSelect: (id: string) => void;
}

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
    selected,
    onSelect,
}) => {
    const { t } = useTranslation();

    return (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={1}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                {t("volcano_component", "Volcano Component:")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {COMPONENTS.map((comp) => {
                    const active = selected === comp.id;
                    return (
                        <Button
                            key={comp.id}
                            variant={active ? "contained" : "outlined"}
                            color={active ? "primary" : "inherit"}
                            onClick={() => onSelect(comp.id)}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                px: 3,
                                fontWeight: active ? 600 : 500,
                            }}
                        >
                            {t(comp.id.replace(/-/g, "_"), comp.label)}
                        </Button>
                    );
                })}
            </Box>
        </Paper>
    );
};
export default ComponentSelector;
