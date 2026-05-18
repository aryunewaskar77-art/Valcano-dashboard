import React, { useRef, useEffect } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface LogStreamProps {
    lines: string[];
    keyword: string;
}

export const LogStream: React.FC<LogStreamProps> = ({ lines, keyword }) => {
    const { t } = useTranslation();
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    // Auto-scroll logic is automatically assisted by followOutput="smooth" in Virtuoso,
    // but we can also force scroll to bottom on initial load or select updates.
    useEffect(() => {
        if (virtuosoRef.current) {
            virtuosoRef.current.scrollToIndex({
                index: lines.length - 1,
                align: "end",
                behavior: "auto",
            });
        }
    }, [lines.length === 1]); // Reset scroll to bottom on new stream startup

    const escapeHtml = (text: string) => {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const highlightText = (line: string, search: string) => {
        const escaped = escapeHtml(line);
        if (!search.trim()) return escaped;

        try {
            // Escape regex chars
            const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            const regex = new RegExp(`(${escapedSearch})`, "gi");
            return escaped.replace(
                regex,
                `<mark style="background-color: #ffeb3b; color: #000000; border-radius: 2px; padding: 1px 2px;">$1</mark>`,
            );
        } catch (err) {
            return escaped;
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                bgcolor: "#1e1e1e",
                color: "#d4d4d4",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #333333",
            }}
        >
            {/* Terminal header */}
            <Box
                sx={{
                    bgcolor: "#2d2d2d",
                    px: 2,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "1px solid #3d3d3d",
                }}
            >
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ff5f56" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ffbd2e" }} />
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#27c93f" }} />
                <Typography
                    variant="caption"
                    sx={{ ml: 2, color: "#8e8e93", fontFamily: "monospace" }}
                >
                    volcano-stream.log
                </Typography>
            </Box>

            <Box sx={{ height: "60vh", width: "100%", p: 1 }}>
                {lines.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontFamily: "monospace",
                            color: "#8e8e93",
                        }}
                    >
                        {t("no_logs_stream", "Waiting for logs connection / No matching log lines...")}
                    </Box>
                ) : (
                    <Virtuoso
                        ref={virtuosoRef}
                        data={lines}
                        followOutput="smooth"
                        style={{ height: "100%" }}
                        itemContent={(index, line) => {
                            const highlighted = highlightText(line, keyword);
                            return (
                                <Box
                                    sx={{
                                        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                                        fontSize: "13px",
                                        lineHeight: "20px",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-all",
                                        py: 0.25,
                                        px: 1,
                                        display: "flex",
                                        borderBottom: "1px solid #252525",
                                        "&:hover": {
                                            bgcolor: "#2a2a2a",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: "#5c6370",
                                            width: "45px",
                                            minWidth: "45px",
                                            textAlign: "right",
                                            paddingRight: "15px",
                                            userSelect: "none",
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <div
                                        style={{ flexGrow: 1 }}
                                        dangerouslySetInnerHTML={{ __html: highlighted }}
                                    />
                                </Box>
                            );
                        }}
                    />
                )}
            </Box>
        </Paper>
    );
};
export default LogStream;
