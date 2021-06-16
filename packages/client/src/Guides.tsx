import React from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import Button from "@material-ui/core/Button";
import CreateGuide from './CreateGuide';
import LaunchGuide from './LaunchGuide';

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
    const { loading, error, data } = useQuery(GET_GUIDES);

    const list = data?.listGuides?.map((item: any) => {
       return <GuideLi><a onClick={() => handleOpenGuide(item.id)} href={'#' + item.id}>{item.name}</a></GuideLi>
     })
    const mainDiv = (<MainDiv>
          <CreateGuide open={openCreate} setOpen={setOpenCreate} GET_GUIDES={GET_GUIDES} />
          <LaunchGuide open={openLaunch} setOpen={setOpenLaunch} />
          <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)}>Create Guide</Button>
          <ListDiv>{list}</ListDiv>
          { guide?.id !== null ? 'Selected ' + guide.id : null }
        </MainDiv>);
    return <div>{loading ? 'Loading...' : (error ? `Error! ${error.message}` : (mainDiv))}</div>;
}
