import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import Button from "@material-ui/core/Button";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { isTemplateExpression } from 'typescript';

const DELETE_SITE = gql`
mutation DeleteSite ($siteURL: String!) {
  deleteSite (siteURL: $siteURL) {
    success
    errorMessage
  } 
}
`;

const MainDiv = styled('div')`
  padding: 20px;
`

export default function Analytics(props: any) {

      const GET_SITES = gql`
      query GetSites {
        listSites {
          siteURL
        }
      }`;
      const { loading, error, data } = useQuery(GET_SITES);

      const [deleteSite] = useMutation(DELETE_SITE, {
        refetchQueries: [
          { query: GET_SITES }
        ]
      });


    const list = data?.listSites?.map((item: any) => {
       return <TableRow> 
              <TableCell>{item.siteURL}</TableCell>  
              <TableCell><IconButton onClick={() => deleteSite({variables: {siteURL: item.siteURL}} as any)}> <DeleteIcon></DeleteIcon> </IconButton></TableCell>            
         </TableRow>
     });
    const mainDiv = (<MainDiv>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
                  <TableHead>
                  <TableRow>
                      <TableCell>Site URL</TableCell>
                      <TableCell>Delete Site</TableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody> {list} </TableBody>
              </Table>
          </TableContainer>
        </MainDiv>);
    return <div>{loading ? 'Loading...' : (error ? `Error! ${error.message}` : (mainDiv))}</div>;
}
