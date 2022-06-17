import React from 'react';
import filter from 'lodash/filter';
import dynamic from 'next/dynamic';
import { Tab, TabList, TabPanel } from 'react-tabs';
import emojiJson from 'emoji.json';
import StyledWrapper from './StyledWrapper';

const Tabs = dynamic(import('react-tabs').then(mod => mod.Tabs), { ssr: false });

const EmojiList = ({group, onClick}) => {
  return (
    <div className="emoji-list" onClick={onClick}>
      {group && group.map((emoji) => {
        return <span className='emoji' data-emoji={true} data-code={emoji.codes} key={emoji.codes}>{emoji.char}</span>;
      })}
    </div>
  );
};

const EmojiPicker = ({handleSelect}) => {
  const peopleGroup = filter(emojiJson, (e) => e.group === 'Smileys & Emotion');
  const objectsGroup = filter(emojiJson, (e) => e.group === 'Objects');
  const activitiesGroup = filter(emojiJson, (e) => e.group === 'Activities');
  const natureGroup = filter(emojiJson, (e) => e.group === 'Animals & Nature');
  const travelGroup = filter(emojiJson, (e) => e.group === 'Travel & Places');
  const symbolsGroup = filter(emojiJson, (e) => e.group === 'Symbols');
  const foodGroup = filter(emojiJson, (e) => e.group === 'Food & Drink');
  const flagsGroup = filter(emojiJson, (e) => e.group === 'Flags');

  const onClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
    if(event.nativeEvent) {
      event.nativeEvent.stopImmediatePropagation();
    }

    if(event.target && event.target.className === 'emoji' && event.target.dataset
    && event.target.dataset.emoji === 'true' && event.target.dataset.code) {
      handleSelect({
        type: 'emoji',
        unicode: event.target.dataset.code
      });
    }
  };
  
  return (
    <StyledWrapper>
      <Tabs defaultIndex={0} >
        <TabList>
          <Tab>😊</Tab>
          <Tab>💡</Tab>
          <Tab>🏈</Tab>
          <Tab>🌿</Tab>
          <Tab>🏝</Tab>
          <Tab>💓</Tab>
          <Tab>🍔</Tab>
          <Tab>🇺🇸</Tab>
        </TabList>
        <TabPanel>
          <EmojiList group={peopleGroup} onClick={onClick}/>
        </TabPanel>
        <TabPanel>
          <EmojiList group={objectsGroup} onClick={onClick}/>
        </TabPanel>
        <TabPanel>
          <EmojiList group={activitiesGroup} onClick={onClick}/>
        </TabPanel>
        <TabPanel>
          <EmojiList group={natureGroup} onClick={onClick}/>
        </TabPanel>
        <TabPanel>
          <EmojiList group={travelGroup} onClick={onClick}/>
        </TabPanel>
        <TabPanel>
          <EmojiList group={symbolsGroup} onClick={onClick}/>
        </TabPanel>
        <TabPanel>
          <EmojiList group={foodGroup} onClick={onClick}/>
        </TabPanel>
        <TabPanel>
          <EmojiList group={flagsGroup} onClick={onClick}/>
        </TabPanel>
      </Tabs>
    </StyledWrapper>
  );
};

export default EmojiPicker;
