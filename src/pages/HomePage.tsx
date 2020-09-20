/** @jsx jsx */
import React, { useState, Fragment, useRef } from 'react';
import { css, jsx } from '@emotion/core';
import {
  Form,
  InputGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
} from 'react-bootstrap';
import { shuffle, padStart } from 'lodash-es';
import ReactPlayer from 'react-player';
import ReactGA from 'react-ga';
import MusicGrid from '../components/MusicGrid';
import { IMusicRecordGrid } from '../models/DataModel';

const HomePage: React.FC = () => {
  const [filterText, setFilterText] = useState<string>();
  const [currentSong, setCurrentSong] = useState<string>();
  const [gridFiltered, setGridFiltered] = useState<boolean>(false);
  const [playlistMode, setPlaylistMode] = useState<boolean>(false);
  const player = useRef<ReactPlayer>(null);
  const shufflePlaylistPool = useRef<IMusicRecordGrid[]>([]);
  const shufflePlaylist = useRef<IMusicRecordGrid[]>([]);
  const currentPlaylistSong = useRef<number>(-1);

  const onFilterTextChanged: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setFilterText(event.target.value);
  };

  // Handle mobile quick filter submission
  const onFilterTextKeyPress: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void = (event) => {
    if (event.key === 'Enter' && document.activeElement) {
      const activeElement = document.activeElement as HTMLElement;
      activeElement.blur();
    }
  };

  /* Playlist mode check (via refs) */
  const inPlaylistMode: () => boolean = () => {
    return (
      currentPlaylistSong.current !== -1 && shufflePlaylist.current.length > 0
    );
  };

  const onSongChange: (song: string) => void = (song) => {
    if (inPlaylistMode()) {
      shufflePlaylist.current = [];
      currentPlaylistSong.current = -1;
      setPlaylistMode(false);
    }
    setCurrentSong(song);
  };

  const setShufflePool: (
    isGridFiltered: boolean,
    shufflePool: IMusicRecordGrid[]
  ) => void = (isGridFiltered, shufflePool) => {
    setGridFiltered(isGridFiltered);
    shufflePlaylistPool.current = shufflePool;
  };

  const onShufflePlaylist: () => void = () => {
    const shuffledSongs = shuffle(
      shufflePlaylistPool.current.filter((song) => song.youtube !== '')
    );
    if (!shuffledSongs.length) return;
    shufflePlaylist.current = shuffledSongs;
    setPlaylistMode(true);
    setCurrentSong(shuffledSongs[0].youtube);
    currentPlaylistSong.current = 0;
    ReactGA.event({
      category: 'Playlist',
      action: gridFiltered
        ? 'Start Shuffled Playlist (Filtered)'
        : 'Start Shuffled Playlist',
      label: 'Shuffle Button',
    });
  };

  const onPreviousPlaylistSong: () => void = () => {
    if (currentPlaylistSong.current < 1) return;
    currentPlaylistSong.current -= 1;
    setCurrentSong(
      shufflePlaylist.current[currentPlaylistSong.current].youtube
    );
  };

  const onNextPlaylistSong: () => void = () => {
    if (currentPlaylistSong.current === shufflePlaylist.current.length - 1)
      return;
    currentPlaylistSong.current += 1;
    setCurrentSong(
      shufflePlaylist.current[currentPlaylistSong.current].youtube
    );
  };

  return (
    <div>
      {currentSong === undefined ? (
        <Fragment>
          <div>
            <img
              css={css`
                display: block;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: 10px;
              `}
              id="header-logo"
              src="assets/pink-bean.png"
              alt="header logo"
            />
          </div>
          <div>
            <p>
              Welcome to the MapleStory Music database. This site provides a
              complete listing of the background music (BGM) used in MapleStory.
              Collectively, the songs are also known as MapleStory's original
              soundtrack (OST).
            </p>
          </div>
        </Fragment>
      ) : (
        <div>
          <ReactPlayer
            css={css`
              display: block;
              margin-left: auto;
              margin-right: auto;
              max-width: 100vw;
            `}
            ref={player}
            url={`https://youtu.be/${currentSong}`}
            playing
            controls
            onEnded={(): void => {
              if (player.current !== null) {
                if (!playlistMode) {
                  player.current.seekTo(0);
                  ReactGA.event({
                    category: 'Video',
                    action: 'Loop Embedded Video',
                    label: currentSong,
                  });
                } else {
                  ReactGA.event({
                    category: 'Video',
                    action: 'Complete Playlist Video',
                    label: currentSong,
                  });
                  if (
                    currentPlaylistSong.current ===
                    shufflePlaylist.current.length - 1
                  )
                    return;
                  currentPlaylistSong.current += 1;
                  setCurrentSong(
                    shufflePlaylist.current[currentPlaylistSong.current].youtube
                  );
                }
              }
            }}
          />
          {playlistMode && (
            <div
              className="text-center"
              css={css`
                margin-top: 5px;
              `}
            >
              <ButtonGroup size="sm">
                <Button
                  variant="outline-primary"
                  onClick={onPreviousPlaylistSong}
                  disabled={currentPlaylistSong.current === 0}
                >
                  <i className="fa fa-step-backward"></i>
                </Button>
                <span
                  css={css`
                    background-color: #343a40;
                    border-color: #343a40;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    border: 1px solid transparent;
                    margin-left: -1px;
                  `}
                >{`${padStart(
                  (currentPlaylistSong.current + 1).toString(),
                  shufflePlaylist.current.length.toString().length,
                  '0'
                )} | ${shufflePlaylist.current.length}`}</span>
                <Button
                  variant="outline-primary"
                  onClick={onNextPlaylistSong}
                  disabled={
                    currentPlaylistSong.current + 1 ===
                    shufflePlaylist.current.length
                  }
                >
                  <i className="fa fa-step-forward"></i>
                </Button>
              </ButtonGroup>
            </div>
          )}
        </div>
      )}
      <Form.Group
        css={css`
          margin: 10px 14vw;
        `}
        className="filter-text"
      >
        <InputGroup size="lg">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <i className="fa fa-search"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text"
            placeholder="Song title or keyword"
            onChange={onFilterTextChanged}
            onKeyPress={onFilterTextKeyPress}
          />
          <InputGroup.Append>
            <OverlayTrigger
              delay={{ show: 250, hide: 100 }}
              overlay={
                <Tooltip id={`tooltip-start-playlist`}>
                  {gridFiltered
                    ? `Start Shuffled Playlist (Filtered)`
                    : `Start Shuffled Playlist`}
                </Tooltip>
              }
            >
              <Button
                variant={gridFiltered ? 'outline-warning' : 'outline-success'}
                onClick={onShufflePlaylist}
              >
                <i className="fa fa-random"></i>
              </Button>
            </OverlayTrigger>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
      <MusicGrid
        query={filterText}
        onSongChange={onSongChange}
        setShufflePool={setShufflePool}
      />
    </div>
  );
};

export default HomePage;
