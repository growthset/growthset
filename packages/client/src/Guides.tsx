import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import Button from "@material-ui/core/Button";
import CreateGuide from './CreateGuide';
import LaunchGuide from './LaunchGuide';
import EditGuide from './EditGuide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { isTemplateExpression } from 'typescript';



const GuideLi = styled('li')`
  color: blue;
`

const MainDiv = styled('div')`
  padding: 20px;
`

const ListDiv = styled('div')`
  padding: 20px;
`
export default function Guides(props: any) {
    const [openCreate, setOpenCreate] = React.useState(false);
    const [openLaunch, setOpenLaunch] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [guide, setGuide] = React.useState<{id: null | string}>({id: null});
    const handleOpenGuide = (id: string) => {
        setGuide({id});
        setOpenLaunch(true);
    };
    const GET_GUIDES = gql`
      query GetGuides {
        listGuides {
          id
          name
        }
      }`;

      const GET_SITES = gql`
      query GetSites {
        listSites {
          siteURL
        }
      }`;

      const DELETE_GUIDE = gql`
        mutation DeleteGuide ($id: ID!) {
          deleteGuide (id: $id) {
            success
            errorMessage
          } 
        }
      `;

      const [deleteGuide] = useMutation(DELETE_GUIDE, {
        refetchQueries: [
          { query: GET_GUIDES }
        ]
      });

    const { loading, error, data } = useQuery(GET_GUIDES);
    const [guideEditing, setGuideEditing] = React.useState(null);
    const list = data?.listGuides?.map((item: any) => {
       return <TableRow> 
              <TableCell>
              <EditGuide open={openEdit} setOpen={setOpenEdit} guide={guideEditing} guideName={(guideEditing as any)?.name} GET_SITES={GET_SITES}/>
                {item.name} 
              <IconButton aria-label="edit" onClick={() => {setGuideEditing(item); setOpenEdit(true)}}> <EditIcon></EditIcon> </IconButton></TableCell>
              <TableCell><a onClick={() => handleOpenGuide(item.id)} href={'#' + item.id}>Launch</a></TableCell> 
              <TableCell><IconButton onClick={() => deleteGuide({variables: {id: item.id}} as any)}> <DeleteIcon></DeleteIcon> </IconButton></TableCell>
         </TableRow>
     });
    const mainDiv = (<MainDiv>
          <CreateGuide open={openCreate} setOpen={setOpenCreate} GET_GUIDES={GET_GUIDES} />
          <LaunchGuide open={openLaunch} setOpen={setOpenLaunch} GET_SITES={GET_SITES}/>
          <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)}>Create Guide</Button>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
                  <TableHead>
                  <TableRow>
                      <TableCell>Guide Name</TableCell>
                      <TableCell>Launch Guide</TableCell>
                      <TableCell>Delete Guide</TableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody> {list} </TableBody>
              </Table>
          </TableContainer>
        </MainDiv>);
    return <div>{loading ? 'Loading...' : (error ? `Error! ${error.message}` : (mainDiv))}</div>;
}
