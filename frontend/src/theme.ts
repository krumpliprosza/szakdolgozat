import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// Leiras: a lapok szineinek definialasa.

const config = defineConfig({
    theme: {
        semanticTokens: {
            colors: {
                bg: {
                    DEFAULT: {
                        value: { _light: "#F1F9E9", _dark: "#0E0616" },
                    },
                    panel: {
                        value: { _light: "#F1F9E9", _dark: "#0E0616" },
                    },
                },
                purple: {
                    border: {
                        value: { _light: "{colors.purple.700}", _dark: "{colors.purple.400}" },
                    },
                    fg: {
                        value: { _light: "{colors.purple.800}", _dark: "{colors.purple.300}" },
                    },
                    solid: {
                        value: { _light: "{colors.purple.700}", _dark: "{colors.purple.600}" },
                    },
                    subtle: {
                        value: { _light: "{colors.purple.200}", _dark: "{colors.purple.900}" },
                    },
                },
                border: {
                    value: { _light: "{colors.purple.700}", _dark: "{colors.purple.400}" },
                },
            },
        },
    },
})

export const system = createSystem(defaultConfig, config)