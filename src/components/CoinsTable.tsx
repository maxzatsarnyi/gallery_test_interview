import React, { useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import axios from 'axios';
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Typography,
  Modal,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  FormLabel,
} from '@material-ui/core';
import { IPhoto } from '../entities';
import { makeStyles } from '@material-ui/styles';
import { Pagination } from '@material-ui/lab';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

export const CoinsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalUrl, setModalUrl] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [searchId, setSearchId] = useState<number>(0);

  const handleChange = (event: ChangeEvent<any>) => {
    setSearchId(parseInt(event.target.value));
  };

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(
      'http://jsonplaceholder.typicode.com/photos'
    );
    setData(data);
    setLoading(false);
  };

  const deletePhoto = (e: React.MouseEvent<HTMLElement>, id: number) => {
    e.stopPropagation();
    setData((prev) => prev.filter((item: IPhoto) => item.id !== id));
  };

  const openModal = (e: MouseEvent<HTMLElement>, url: string) =>
    setModalUrl(url);
  const closeModal = () => setModalUrl('');

  const handleSearch = () => {
    return data.filter((item: IPhoto) => item.albumId === searchId);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const useStyles = makeStyles(() => ({
    container: { maxWidth: 1200, width: '100%', margin: '0 auto' },
    row: {
      cursor: 'pointer',
      fontFamily: 'Montserrat',
    },
    pagination: {
      '& .MuiPaginationItem-root': {
        color: '#4fedaf',
      },
    },
    imageList: { padding: '0 10px' },
    modalContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 600,
      width: '100%',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    closeModal: { position: 'absolute', right: 15, top: 15 },
    formFilter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    select: {
      width: 80,
      marginLeft: 30,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: { marginTop: 20 },
  }));
  const classes = useStyles();

  return (
    <div style={{ textAlign: 'center' }} className={classes.container}>
      <Typography variant='h4' style={{ margin: 18, fontFamily: 'Montserrat' }}>
        {/* Cryptocurrency Prices by Market Cap */}
      </Typography>
      <FormControl className={classes.formFilter}>
        <FormLabel id='demo-simple-select-label' className={classes.label}>
          Filter by albumId
        </FormLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={searchId}
          label='albumId'
          onChange={handleChange}
          className={classes.select}
        >
          <MenuItem value={0} onChange={handleChange}>
            <em>None</em>
          </MenuItem>
          {data
            .map((item: IPhoto) => item.albumId)
            .filter((i, p, arr) => arr.lastIndexOf(i) === p)
            .map((it) => (
              <MenuItem key={it} value={it} onChange={handleChange}>
                {it}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <div>
        {loading ? (
          <LinearProgress style={{ backgroundColor: '#4fedaf' }} />
        ) : (
          <>
            {searchId ? (
              <ImageList rowHeight={180} className={classes.imageList}>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((item: IPhoto) => (
                    <ImageListItem
                      key={item.id}
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        openModal(e, item.url)
                      }
                    >
                      <img src={item.thumbnailUrl} alt={item.title} />
                      <ImageListItemBar
                        title={<div>{item.title}</div>}
                        subtitle={<span>ALbum id: {item.albumId}</span>}
                        actionIcon={
                          <IconButton
                            aria-label={`info about ${item.title}`}
                            data-iconname='propp'
                            onClick={(e: MouseEvent<HTMLElement>) =>
                              deletePhoto(e, item.id)
                            }
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
              </ImageList>
            ) : (
              <ImageList rowHeight={180} className={classes.imageList}>
                {data
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((item: IPhoto) => (
                    <ImageListItem
                      key={item.id}
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        openModal(e, item.url)
                      }
                    >
                      <img src={item.thumbnailUrl} alt={item.title} />
                      <ImageListItemBar
                        title={<div>{item.title}</div>}
                        subtitle={<span>ALbum id: {item.albumId}</span>}
                        actionIcon={
                          <IconButton
                            aria-label={`info about ${item.title}`}
                            onClick={(e: MouseEvent<HTMLElement>) =>
                              deletePhoto(e, item.id)
                            }
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
              </ImageList>
            )}
          </>
        )}
      </div>
      <Modal
        open={!!modalUrl}
        onClose={closeModal}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <div className={classes.modalContainer}>
          <img src={modalUrl} alt='photo' />
          <span className={classes.closeModal} onClick={closeModal}>
            <HighlightOffIcon />
          </span>
        </div>
      </Modal>
      <Pagination
        style={{
          padding: 20,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
        classes={{ ul: classes.pagination }}
        count={
          searchId
            ? Math.trunc(handleSearch()?.length / 10)
            : Math.trunc(data?.length / 10)
        }
        onChange={(_, value) => {
          setPage(value);
          window.scroll(0, 450);
        }}
      />
    </div>
  );
};
