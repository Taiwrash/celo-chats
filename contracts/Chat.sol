// SPDX-License-Identifier: 	AFL-1.1
pragma solidity ^0.8.0;

contract Chat {
  struct Message {
    address sender;
    string text;
    uint timestamp;
  }

  Message[] public messages;

  event NewMessage(address sender, string text);

  function sendMessage(string memory text) public {
    messages.push(Message(msg.sender, text, block.timestamp));
    emit NewMessage(msg.sender, text);
  }
}
