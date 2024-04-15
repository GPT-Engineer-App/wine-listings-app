import { useState, useEffect } from "react";
import { Box, Heading, Text, Image, Button, Input, Stack, FormControl, FormLabel, useToast, Select } from "@chakra-ui/react";
import { FaPlus, FaSort } from "react-icons/fa";

const API_URL = "https://backengine-y56e.fly.dev";

const Index = () => {
  const [wines, setWines] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchWines(token);
    }
  }, []);

  const fetchWines = async (token) => {
    const res = await fetch(`${API_URL}/wines`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setWines(data);
  };

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { accessToken } = await res.json();
      localStorage.setItem("token", accessToken);
      setIsLoggedIn(true);
      fetchWines(accessToken);
    } else {
      const { error } = await res.json();
      toast({
        title: "Login Failed",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSignup = async () => {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 204) {
      toast({
        title: "Signup Successful",
        description: "You can now login",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const { error } = await res.json();
      toast({
        title: "Signup Failed",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddWine = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/wines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        year: parseInt(year),
        description,
        image,
        kv: {},
      }),
    });

    if (res.ok) {
      fetchWines(token);
      setTitle("");
      setYear("");
      setDescription("");
      setImage("");
    }
  };

  const sortedWines = [...wines].sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  return (
    <Box p={8}>
      <Heading as="h1" mb={8}>
        My Wine Collection
      </Heading>

      {!isLoggedIn ? (
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleLogin}>Login</Button>
          <Button onClick={handleSignup}>Signup</Button>
        </Stack>
      ) : (
        <>
          <Stack direction="row" mb={8}>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} w="auto">
              <option value="title">Sort by Title</option>
              <option value="year">Sort by Year</option>
            </Select>
            <Button leftIcon={<FaSort />}>Sort</Button>
          </Stack>

          <Stack spacing={8}>
            {sortedWines.map((wine) => (
              <Box key={wine.id} borderWidth={1} p={4}>
                <Image src={`data:image/jpeg;base64,${wine.image}`} alt={wine.title} mb={4} />
                <Heading as="h2" size="md">
                  {wine.title}
                </Heading>
                <Text>Year: {wine.year}</Text>
                <Text>{wine.description}</Text>
              </Box>
            ))}
          </Stack>

          <Stack spacing={4} mt={8}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Year</FormLabel>
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Image (Base64)</FormLabel>
              <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </FormControl>
            <Button leftIcon={<FaPlus />} onClick={handleAddWine}>
              Add Wine
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Index;
