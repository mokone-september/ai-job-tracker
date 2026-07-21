"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, gray.950, blue.950)"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      <Container maxW="4xl">
        <Stack gap={8} textAlign="center">
          <Badge
            colorPalette="blue"
            alignSelf="center"
            px={4}
            py={2}
            rounded="full"
            fontSize="sm"
          >
            🚧 Coming Soon
          </Badge>

          <Heading
            size="2xl"
            fontWeight="bold"
            lineHeight="shorter"
          >
            AI Job Tracker
          </Heading>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.300"
            maxW="2xl"
            mx="auto"
          >
            Organize your entire job search in one place.
            Track applications, companies, interviews, resumes,
            cover letters, and receive AI-powered feedback to help
            you land your next role faster.
          </Text>

          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.300"
          >
            The app is coming soon 🚀
          </Text>

          <Stack
            direction={{ base: "column", md: "row" }}
            justify="center"
            gap={4}
          >
            <Button
              colorPalette="blue"
              size="lg"
            >
              🚀 Stay Tuned
            </Button>

            <Button
              variant="outline"
              colorPalette="gray"
              size="lg"
              as="a"
              href="https://github.com/mokone-september/ai-job-tracker"
              target="_blank"
            >
              ⭐ View on GitHub
            </Button>
          </Stack>

          <Text
            fontSize="sm"
            color="gray.500"
          >
            Built with Next.js 16 • Chakra UI • TinyBase • Strapi 5 •
            TypeScript
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
