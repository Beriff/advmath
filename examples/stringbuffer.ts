import { Stream, StreamBuffer } from '../src/am_types'

// Initialize the stream
let sstream: Stream<string> = new Stream<string>();

// Initialize the buffer
let ssbuf: StreamBuffer<string> = sstream.GetBuffer();

sstream.FeedC("hello ").FeedC("world").Feed("!"); // FeedC() allows chaining; Feed() returns void.

console.log(ssbuf.ReadBuffer().join(''));