import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import Button from "@material-ui/core/Button";
import AddUser from './AddUser';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const MainDiv = styled('div')`
  padding: 20px;
`

export default function Users(props: any) {
    const [openCreate, setOpenCreate] = React.useState(false);

    const DELETE_USER = gql`
      mutation DeleteUser ($email: String!) {
        deleteUser (email: $email) {
          success
          errorMessage
        } 
      }
      `;

    const GET_USERS = gql`
      query GetUsers {
        listUsers {
          local {
            email
          },
          role
        }
      }`;
      const { loading, error, data } = useQuery(GET_USERS);
      const [ deleteUser] = useMutation(DELETE_USER, {
        refetchQueries: [
          { query: GET_USERS }
        ]
      });


      function removeUser(userEmail) {
        deleteUser({variables: {email: userEmail}} as any);
      }
      const list = data?.listUsers?.map((item: any) => {
        return <TableRow> <TableCell component="th" scope="row">{item.local.email}</TableCell> <TableCell component="td">{item.role}</TableCell> 
        { item.role != "admin" ? <TableCell component="td"> <IconButton onClick={() => removeUser(item.local.email)}> <DeleteIcon></DeleteIcon> </IconButton> </TableCell> : <TableCell></TableCell>}</TableRow>
      })
    const mainDiv = (<MainDiv>
          <AddUser open={openCreate} setOpen={setOpenCreate} GET_USERS={GET_USERS} > </AddUser>
          <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)}>Add User</Button>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Remove User</TableCell>
                </TableRow>
                </TableHead>
                <TableBody> {list} </TableBody>
            </Table>
        </TableContainer>
        </MainDiv>);
    return <div>{loading ? 'Loading...' : (error ? `Error! ${error.message}` : (mainDiv))}</div>;
}
