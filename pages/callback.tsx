import { Grid, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import * as React from "react";

import { ApiResponse } from "../src/types";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { code } = ctx.query;
  const resp = await fetch("http://127.0.0.1:3000/api/callback?code=" + code);
  const data: ApiResponse = await resp.json();

  console.log(data);

  if (!data.success) {
    ctx.res.statusCode = 302;
    ctx.res.setHeader("Location", "/");
    ctx.res.end();
    return { props: {} };
  }

  return { props: { data } };
};

const Callback: NextPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const apiResponse: ApiResponse = data;
  const userData = apiResponse.data.user;
  const userGuilds = apiResponse.data.userGuilds;
  const userAvatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
  return (
    <Container
      maxWidth="lg"
      sx={{
        my: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Discord User stats
        </Typography>
      </Box> */}
      <Box
        maxWidth="sm"
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={2} xs={4}>
                <Avatar
                  alt="avatar"
                  src={userAvatar}
                  sx={{ mt: 4, width: 100, height: 100 }}
                />
              </Grid>
              <Grid item md={6} xs={4} sx={{ mt: 12 }}>
                {userData.flags_formatted?.map((value) => (
                  <Tooltip
                    key={value}
                    title={value}
                    placement="top"
                    disableInteractive
                  >
                    <IconButton key={value} size="small">
                      <Image
                        key={value}
                        alt={value}
                        width={20}
                        height={20}
                        src={"/images/" + value + ".webp"}
                      />
                    </IconButton>
                  </Tooltip>
                ))}
              </Grid>
              <Grid item md={12} xs={4}>
                <Typography variant="h4" component="div" gutterBottom>
                  {userData.username}#{userData.discriminator}
                </Typography>
              </Grid>
              {/* <Grid item md={12} xs={4}></Grid> */}
            </Grid>
            <Typography variant="subtitle1" component="div">
              You are in {userGuilds.count.toLocaleString()} servers, and owns{" "}
              {userGuilds.ownedGuilds.toLocaleString()} of them
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Permissions list
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Permission name</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(userGuilds.permissions).map((key) => {
                return (
                  <>
                    <TableRow
                      key={key}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell align="right">
                        {userGuilds.permissions[key]}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Callback;
