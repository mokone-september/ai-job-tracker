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
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const { user, logout } = useAuth();

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
            {user ? (
              <>
                <Link href="/cv-analysis">
                  <Button colorPalette="blue" size="lg">Analyze your CV</Button>
                </Link>
                <Link href="/interview-prep">
                  <Button variant="outline" colorPalette="gray" size="lg">Prepare for interview</Button>
                </Link>
                <Link href="/resume">
                  <Button variant="outline" colorPalette="gray" size="lg">Manage resume</Button>
                </Link>
                <Link href="/company-tracker">
                  <Button variant="outline" colorPalette="gray" size="lg">Track companies</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" colorPalette="gray" size="lg">Open dashboard</Button>
                </Link>
                <Button variant="outline" colorPalette="gray" size="lg" onClick={logout}>
                  Sign out ({user.username})
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button colorPalette="blue" size="lg">
                  Sign in or register
                </Button>
              </Link>
            )}

            <Link
              href="https://github.com/mokone-september/ai-job-tracker"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" colorPalette="gray" size="lg">
              ⭐ View on GitHub
              </Button>
            </Link>
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
