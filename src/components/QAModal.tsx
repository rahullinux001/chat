"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useCompletion } from "ai/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import "./QA.css";

var last_name = "";

export default function QAModal({
  open,
  setOpen,
  example,
}: {
  open: boolean;
  setOpen: any;
  example: any;
}) {
  // Added state for submitted message
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Set the language
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      console.log('Text-to-speech is not supported in this browser.');
    }
  };



  if (!example) {
    // create a dummy so the completion doesn't croak during init.
    example = new Object();
    example.llm = "";
    example.name = "";
    example.imageUrl = "";
  }

  const {
    completion,
    isLoading,
    handleInputChange,
    handleSubmit,
    stop,
    setCompletion,
  } = useCompletion({
    api: "/api/" + example.llm,
    headers: { name: example.name, imageUrl: example.imageUrl },
  });


  if (!example) {
    console.log("ERROR: no companion selected");
    return null;
  }

  const handleClose = () => {
    setSubmittedMessage(input);
    setInput("");
    setCompletion("");
    stop();
    setOpen(false);
  };





  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-950 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-14 pt-96 text-left shadow-xl transition-all w-full max-w-sm">
                <div style={{ paddingTop: "20px" }}>
                  <div className="botIcon">
                    <div className="Layout Layout-open Layout-expand Layout-right">
                      <div className="Messenger_messenger">
                        <div className="Messenger_header">
                          <span
                            className="chat_close_icon"
                            onClick={handleClose}
                          >
                            <i
                              className="fa fa-chevron-left fa-fw custom-icon"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <h4 className="Messenger_prompt">
                            <img
                              src={example.imageUrl}
                              alt=""
                              style={{
                                width: "28px",
                                height: "28px",
                                marginTop: "-5px",
                                borderRadius: "15px"
                              }}
                            />
                            &nbsp;&nbsp;{example.name}
                          </h4>
                          <span
                            className="chat_close_icon1"
                            onClick={handleClose}
                          >
                            <i
                              className="fa fa-phone"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <span
                            className="chat_close_icon2"
                            onClick={handleClose}
                          >
                            <FontAwesomeIcon icon={faVideo} />
                          </span>
                        </div>
                        <div className="Messenger_content">
                          <div className="Messages">
                            <div className="Messages_list">
                              {input && (
                                <div className="msg user">
                                  <span className="avtr">
                                    <figure><img src="image.png" alt="icon" style={{ width: "100%", height: "30px", borderRadius: "14px" }} /></figure>
                                  </span>

                                  <span className="responsText">{input}</span>
                                </div>
                              )}
                              {completion && (
                                <div className="msg">
                                  <span className="avtr1">
                                    <figure><img src={example.imageUrl} alt="icon" style={{ width: "100%", height: "30px", borderRadius: "14px" }} /></figure>
                                  </span>

                                  <span className="responsText">
                                    {isSpeaking ? (
                                      // Render a different icon when audio is playing
                                      <FontAwesomeIcon icon={faPause} style={{ cursor: "pointer" }}  />
                                    ) : (
                                      // Render the original text-to-speech icon
                                      <FontAwesomeIcon
                                        icon={faCirclePlay}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleTextToSpeech(completion)}
                                      />
                                    )}
                                    &nbsp;
                                    {completion}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <form onSubmit={handleSubmit}>
                            <div className="Input Input-blank" style={{ display: "flex" }}>
                              &nbsp;😊
                              <input
                                name="msg"
                                className="Input_field"
                                placeholder="Send a message..."
                                onKeyDown={(e: any) => {
                                  if (e.key === "Enter") {
                                    handleInputChange(e);
                                    setInput(e.target.value)
                                  }
                                }}
                              />
                              <button
                                type="submit"
                                className="Input_button Input_button-send"
                              >
                                <div className="Icon">
                                  <svg
                                    viewBox="1496 193 57 54"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                  // style={{marginTop:"4px"}}
                                  >
                                    <g
                                      id="Group-9-Copy-3"
                                      stroke="none"
                                      strokeWidth="1"
                                      fill="none"
                                      fillRule="evenodd"
                                      transform="translate(1523.000000, 220.000000) rotate(-270.000000) translate(-1523.000000, -220.000000) translate(1499.000000, 193.000000)"
                                    >
                                      <path
                                        d="M5.42994667,44.5306122 L16.5955554,44.5306122 L21.049938,20.423658 C21.6518463,17.1661523 26.3121212,17.1441362 26.9447801,20.3958097 L31.6405465,44.5306122 L42.5313185,44.5306122 L23.9806326,7.0871633 L5.42994667,44.5306122 Z M22.0420732,48.0757124 C21.779222,49.4982538 20.5386331,50.5306122 19.0920112,50.5306122 L1.59009899,50.5306122 C-1.20169244,50.5306122 -2.87079654,47.7697069 -1.64625638,45.2980459 L20.8461928,-0.101616237 C22.1967178,-2.8275701 25.7710778,-2.81438868 27.1150723,-0.101616237 L49.6075215,45.2980459 C5.08414042,47.7885641 49.1422456,50.5306122 46.3613062,50.5306122 L29.1679835,50.5306122 C27.7320366,50.5306122 26.4974445,49.5130766 26.2232033,48.1035608 L24.0760553,37.0678766 L22.0420732,48.0757124 Z"
                                        id="sendicon"
                                        fill="#96AAB4"
                                        fillRule="nonzero"
                                      ></path>
                                    </g>
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}