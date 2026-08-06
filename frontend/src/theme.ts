import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        semanticTokens: {
            colors: {
                bg: {
                    value: { _light: "#F9F3FF", _dark: "#0E0616" },
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
            },
        },
    },
})

export const system = createSystem(defaultConfig, config)