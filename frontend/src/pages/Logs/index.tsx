import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Badge } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ComponentSelector } from "./ComponentSelector";
import { LogControls } from "./LogControls";
import { LogStream } from "./LogStream";
import TitleComponent from "../../components/Titlecomponent";

const MAX_LINES_LIMIT = 2000;

export const LogsPage: React.FC = () => {
    const { t } = useTranslation();
    const [component, setComponent] = useState<string>("volcano-scheduler");
    const [tailLines, setTailLines] = useState<number>(200);
    const [keyword, setKeyword] = useState<string>("");
    const [lines, setLines] = useState<string[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<
        "connecting" | "connected" | "disconnected"
    >("disconnected");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setLines([]);
        setConnectionStatus("connecting");
        setErrorMsg(null);

        // Open EventSource SSE connection
        const sseUrl = `/api/v1/logs?component=${component}&tailLines=${tailLines}`;
        console.log(`Connecting to SSE Log Stream: ${sseUrl}`);
        const eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => {
            setConnectionStatus("connected");
            setErrorMsg(null);
        };

        eventSource.onmessage = (event) => {
            const newLine = event.data;
            setLines((prevLines) => {
                const updated = [...prevLines, newLine];
                if (updated.length > MAX_LINES_LIMIT) {
                    return updated.slice(updated.length - MAX_LINES_LIMIT);
                }
                return updated;
            });
        };

        eventSource.onerror = (err) => {
            console.error("SSE connection error:", err);
            setConnectionStatus("disconnected");
            setErrorMsg(
                t(
                    "logs_connection_failed",
                    "Log stream connection failed. Ensure Volcano components are running and backend has log permissions.",
                ),
            );
            eventSource.close();
        };

        return () => {
            console.log(`Closing EventSource connection for ${component}`);
            eventSource.close();
        };
    }, [component, tailLines]);

    // Filter lines based on keyword
    const filteredLines = lines.filter((line) =>
        line.toLowerCase().includes(keyword.toLowerCase()),
    );

    const getStatusColor = () => {
        switch (connectionStatus) {
            case "connected":
                return "#27c93f";
            case "connecting":
                return "#ffbd2e";
            default:
                return "#ff5f56";
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case "connected":
                return t("streaming", "Streaming Live");
            case "connecting":
                return t("connecting", "Connecting...");
            default:
                return t("disconnected", "Disconnected");
        }
    };

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <TitleComponent text={t("component_logs", "Volcano Component Logs")} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: getStatusColor(),
                            animation:
                                connectionStatus === "connecting"
                                    ? "pulse 1.5s infinite"
                                    : "none",
                            "@keyframes pulse": {
                                "0%": { opacity: 0.3 },
                                "50%": { opacity: 1 },
                                "100%": { opacity: 0.3 },
                            },
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                        {getStatusText()}
                    </Typography>
                </Box>
            </Box>

            {errorMsg && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    {errorMsg}
                </Alert>
            )}

            <ComponentSelector selected={component} onSelect={setComponent} />

            <LogControls
                tailLines={tailLines}
                onTailLinesChange={setTailLines}
                keyword={keyword}
                onKeywordChange={setKeyword}
            />

            <LogStream lines={filteredLines} keyword={keyword} />
        </Box>
    );
};

export default LogsPage;
