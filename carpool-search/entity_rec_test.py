__author__ = 'Leandra'
import numpy as np
import matplotlib as plt
import pandas as pd
import nltk
import re
import time
import random, math, json
from sutime import SUTime
from nltk.tag.stanford import StanfordNERTagger
from nltk.internals import find_jars_within_path
import os


def load_data(csv_fpath):
        print("loading data")
        data = pd.read_csv(csv_fpath, encoding = 'latin1')

        return data

##let the fun begin!##
def processLanguage(messages):
    vocab = {}
    try:
        for item in messages:
            tokenized = nltk.word_tokenize(item)
            tagged = nltk.pos_tag(tokenized)
            print tagged

            for (word, tag) in tagged:
                if tag == 'NNP':
                    if word in vocab:
                        vocab[word] += 1
                    else:
                        vocab[word] = 1
            #namedEnt = nltk.ne_chunk(tagged)
            #namedEnt.draw()


    except Exception, e:
        print str(e)
    return vocab

def processLanguage2(messages):
    vocab = {}
    try:
        for (_, item, _) in messages:
            tokenized = nltk.word_tokenize(item)
            tagged = nltk.pos_tag(tokenized)
            print tagged

            for (word1, tag1), (word2, tag2) in zip(tagged, tagged[1:]):
                if word1.lower() == 'to' and tag2 == 'NNP':
                    if word2 in vocab:
                        vocab[word2] += 1
                    else:
                        vocab[word2] = 1
            #namedEnt = nltk.ne_chunk(tagged)
            #namedEnt.draw()


    except Exception, e:
        print str(e)
    return vocab

def processLanguage3(messages):
    jar_files = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'stanford-ner-2015-12-09')
    print(jar_files)
    sutime = SUTime(jars=jar_files, mark_time_ranges=True)


    try:
        for (_, item, date) in messages:
            print(item)
            #print(json.dumps(sutime.parsedate(item, date), sort_keys=True, indent=4))
            print(sutime.parsedate(item, date))
            #namedEnt = nltk.ne_chunk(tagged)
            #namedEnt.draw()


    except Exception, e:
        print str(e)


def processLanguage4(messages):
    vocab = {}
    try:
        for (_, item, _) in messages:
            tokenized = nltk.word_tokenize(item)
            tagged = nltk.pos_tag(tokenized)
            namedEnt = nltk.ne_chunk(tagged)
            print(namedEnt)
            #namedEnt.draw()


    except Exception, e:
        print str(e)
    return vocab

def processLanguage5(messages):
    stanford_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'stanfordjars')
    st = StanfordNERTagger('ner-model.ser.gz', os.path.join(stanford_dir, 'stanford-ner.jar'))
    #st._stanford_jar = os.path.join(stanford_dir, 'stanford-ner.jar')
    #print(st._stanford_jar)
    #stanford_jars = find_jars_within_path(stanford_dir)
    #print ":".join(stanford_jars)
    #st._stanford_jar = ':'.join(stanford_jars)
    st._stanford_jar = os.path.join(stanford_dir, '*')
    posts = []
    for (_, item, _) in messages:
        tokenized = nltk.word_tokenize(item)
        posts += tokenized
        posts.append("\n")
        posts.append("\n")
    print(posts)
    tagging = st.tag(posts)
    print(tagging)
    print(extract_chunks(tagging))
    print(messages[0][0])
    tokenize = nltk.word_tokenize(messages[0][0])
    print(st.tag(tokenize))


def extract_chunks(tagged_sent, chunk_type='LOC'):
    locations = []
    chain = False
    location = ''
    for (word, tag) in tagged_sent:
        if tag == chunk_type and not chain: #start of chain
            location += word
            chain = True
        elif tag == chunk_type and chain: #add on to chain
            location += " " + word
        elif tag != chunk_type and chain: #chain ended
            locations.append(location)
            location = ''
            chain = False
    return locations



if __name__ == '__main__':
    csv = "shuffled_posts.csv"
    data = load_data(csv)
    print(data['status_message'][1])
    processLanguage5(zip(data['group_name'][400:500],data['status_message'][400:500], data['status_published'][400:500]))