import React, {useCallback, useEffect, useState} from 'react';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Board = () => {
    const [board, setBoard] = useState(null);

    const {id} = useParams();

    const loginMemberId = useSelector(state => state.memberSlice.id);

    const navi = useNavigate();

    const findById = useCallback(async () => {
        try {
            const response = await axios.get(`http://223.130.158.161:9090/boards/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                }
            });

            setBoard(() => response.data.item);
        } catch(e) {
            alert('에러가 발생했습니다.');
        }
    }, [id]);

    useEffect(() => {
        findById();
    }, []);
    
    const deleteById = useCallback(async () => {
        try {
            const resonse = await axios.delete(`http://223.130.158.161:9090/boards/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('ACCESS_TOKEN')}`
                }
            });

            if(resonse.data.statusCode === 204) {
                alert('정상적으로 삭제되었습니다.');
                navi('/board-list');
            }
        } catch(e) {
            alert('에러가 발생했습니다.');
        }
    }, [id, navi]);

  return (
    <Container maxWidth='md' style={{marginTop: '3%', textAlign: 'center'}}>
        <Grid container>
            <Grid item xs={12}>
                <Typography component='h1' variant='h5'>
                    게시글 상세
                </Typography>
            </Grid>
        </Grid>
        <form>
            {board != null && <input type='hidden' name='id' id='id' value={board.id}></input>}
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            제목
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='title'
                               id='title'
                               fullWidth
                               size='small'
                               required
                               value={board != null ? board.title : ''}
                               aria-readonly={board != null && loginMemberId != board.writer_id
                                ? 'true' : 'false'}
                    ></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            작성자
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='nickname'
                               id='nickname'
                               fullWidth
                               size='small'
                               required
                               aria-readonly='true'
                               value={board != null ? board.nickname : ''}
                    ></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            내용
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='content'
                               id='content'
                               fullWidth
                               size='small'
                               required
                               multiline
                               rows={10}
                               value={board != null ? board.content : ''}
                               aria-readonly={board != null && loginMemberId != board.writer_id
                                ? 'true' : 'false'}></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            작성일
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='regdate'
                               id='regdate'
                               fullWidth
                               size='small'
                               aria-readonly='true'
                               value={board != null ? board.regdate.substring(0, board.regdate.indexOf('T')) : ''}></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            수정일
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='moddate'
                               id='moddate'
                               fullWidth
                               size='small'
                               value={board != null ? board.moddate.substring(0, board.moddate.indexOf('T')) : ''}
                               aria-readonly='true'></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            조회수
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <TextField name='cnt'
                               id='cnt'
                               fullWidth
                               size='small'
                               value={board != null ? board.cnt: ''}
                               aria-readonly='true'></TextField>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            파일첨부
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <Button type='button' variant='outlined'>파일 선택</Button>
                    <input type='file'
                           multiple
                           name='uploadFiles'
                           id='uploadFiles'
                           style={{display: 'none'}}></input>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={2}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography component='p' variant='string'>
                            미리보기
                        </Typography>
                </Grid>
                <Grid item
                      xs={10}>
                    <Container component='div' name='preview' id='preview'>
                        {board != null && board.boardFileDtoList.map((boardFile, index) => (
                            <div key={index}
                                 style={{
                                    display: 'inline-block',
                                    position: 'relative',
                                    width: '150px',
                                    height: '120px',
                                    margin: '5px',
                                    border: '1px solid #00f',
                                    zIndex: 1
                                 }}
                            >
                                <input type='file'
                                       style={{display: 'none'}}
                                       id={`changeFile${boardFile.id}`}
                                ></input>
                                <img width='150px'
                                     height='90px'
                                     style={{zIndex: 'none', cursor: 'pointer'}}
                                     className='fileImg'
                                     id={`img${boardFile.id}`}
                                     src={boardFile.filetype === 'image'
                                        ? `https://kr.object.ncloudstorage.com/camp120/${boardFile.filepath}${boardFile.filename}`
                                        : '/images/defaultFileImg.png'
                                     }
                                ></img>
                                <input type='button'
                                       className='delete-btn'
                                       value='x'
                                       style={{
                                        width: '30px',
                                        height: '30px',
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 999,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#f00'
                                       }}
                                ></input>
                                <p style={{
                                        display: 'inline-block',
                                        fontSize: '8px'
                                    }}
                                   id={`filename${boardFile.id}`}
                                >{boardFile.fileoriginname}</p>
                            </div>
                        ))}
                    </Container>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: '3%', textAlign: 'center'}}>
                <Grid item
                      xs={12}
                      style={
                        board != null && loginMemberId === board.writer_id
                        ? {display: 'block'}
                        : {display: 'none'}
                      }>
                        <Button type='submit' variant='contained'>수정</Button>
                        <Button type='button' variant='contained' style={{marginLeft: '2%'}}
                                onClick={deleteById}>삭제</Button>
                </Grid>
            </Grid>
        </form>
    </Container>
  );
};

export default Board;