import React, { useEffect, useRef, useState } from "react";

// IMAGES
import map1Image from "../pictures/maps/map1.jpg";
import characterImage from "../pictures/characters/mainChar.svg";
import dealerCharImage from "../pictures/characters/dealerChar.svg";
import anotherCharImage from "../pictures/characters/anotherChar.svg";

export default function Canvas() {

    const mapWidth = 1500;
    const mapHeight = 500;
    const [canvasSize, setCanvasSize] = useState({
        width: mapWidth,
        height: mapHeight
    })


    const mainDivRef = useRef(null);
    const mainDivRef2 = useRef(null);
    const canvasRef = useRef(null);

    const [clickedX, setClickedX] = useState(700);

    const questionSet = [
        {
            index: 1,
            question: "1. Co čumíš jak zvadlá piča?",
            answer: "Aaaa pán si bude přát pobodat?",
            continue: true,
            next: [3]
        },
        {
            index: 2,
            question: "2. Ne more dej crack!",
            answer: "A máš prachy?",
            continue: true,
            next: [4]
        },
        {
            index: 3,
            question: "Ani nee díky",
            answer: "Padej...",
            continue: false,
        },
        {
            index: 4,
            question: "Ne ale můžu ti dát ledvinu.",
            answer: "Sorry ale beru jen cash.",
            continue: false,
        },
    ]



    // DIALOG
    const [showQuestion, setShowQuestion] = useState({
        opacity: "0",
        questions: [questionSet[0], questionSet[1]]
    })

    const [showAnswer, setShowAnswer] = useState({
        opacity: "0",
        text: ""
    })



    // MAP
    const map1 = new Image();
    map1.src = map1Image;

    // CHARACTER
    const character = new Image();
    character.src = characterImage;

    // OTHER CHAR
    const character2 = new Image();
    character2.src = dealerCharImage;


    // arc definition
    const r = 5;
    const x = useRef(700);


    // HORIZONTAL SCROLL
    function scrollHorizontally() {
        const halfScreenWidth = window.innerWidth / 2;


        if (mainDivRef.current) {
            if (x.current > halfScreenWidth) {
                mainDivRef.current.scrollLeft = x.current - halfScreenWidth;
                mainDivRef2.current.scrollLeft = x.current - halfScreenWidth;
            }
        }
    }

    // MOVING
    function move(e) {
        const rect = canvasRef.current.getBoundingClientRect();
        const thisX = e.clientX - rect.left;
        setClickedX(thisX);

        setShowQuestion({
            ...showQuestion, opacity: "0",
        })

        setShowAnswer({
            opacity: "0",
            text: ""
        })
    }

    // SIZE CALCULATION
    function canvasSizeCalculation() {
        const windowHeight =  window.innerHeight;
        const aspectRatio = mapWidth / mapHeight;
        const thisWidth = windowHeight * aspectRatio;

        setCanvasSize({
            width: thisWidth,
            height: windowHeight
        })
    }

    // ANIMATION
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");


        // animation handler (prevents the animation from speeding up on each update)
        const timerIdHolder = { timerId: null };

        // animation function
        const render = () => {

            const thisWindowHeight = window.innerHeight;

            // animation request
            timerIdHolder.timerId = window.requestAnimationFrame(render);

            if (clickedX > x.current + 10) {
                x.current += thisWindowHeight / 80;
            } else if (clickedX < x.current - 10) {
                x.current -= thisWindowHeight / 80;;
            }

            // canvas shape
            context.clearRect(0, 0, canvas.width, canvas.height);

            // draw map
            context.drawImage(map1, 0, 0, canvas.width, canvas.height);


            // draw character
            context.drawImage(character, x.current - 65, thisWindowHeight * 0.75, thisWindowHeight / 5, thisWindowHeight / 5);



            scrollHorizontally();
        };
        render();

        // animation cancel
        return () => cancelAnimationFrame(timerIdHolder.timerId);
    }, [clickedX]);


    // canvas size calculation
    useEffect(() => {
        canvasSizeCalculation()
    }, [])


    console.log("----------")
    console.log(showQuestion)

    return (
        <div
        ref={mainDivRef2}
        style={{
            //display: "flex",
            overflowX: "hidden",
            position: "relative",
            background: "blue"
        }}
        >
            <div
                ref={mainDivRef}
                className="Canvas"
                style={{
                    //overflowX: "hidden",
                    //position: "relative"
                }}
                onClick={move}
            >
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    height={canvasSize.height}
                    width={canvasSize.width}
                />
            </div>



            <img 
                onClick={() => {
                    setShowQuestion({
                        opacity: "1",
                        questions: [questionSet[0], questionSet[1]]
                    });

                    setShowAnswer({
                        opacity: "0",
                        text: ""
                    })
                }}
                src={dealerCharImage}
                width={canvasSize.height * 0.2}
                height="auto"
                style={{
                    position: "absolute",
                    zIndex: "10",
                    top: "75%",
                    left: "10%",
                    cursor: "pointer"
                }}
            />

            <img 
            src={anotherCharImage}
            width={canvasSize.height * 0.2}
            height="auto"
            style={{
                position: "absolute",
                zIndex: "10",
                top: "75%",
                left: canvasSize.width * 0.9 + "px",
                cursor: "pointer"
            }}
            />

            <div
            style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                width: "200px",
                gap: "5px",
                zIndex: "10",
                top: "50%",
                left: x.current - 20 + "px",
                background: "white",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                opacity: showQuestion.opacity
            }}
            >

                {showQuestion.questions.map((item, index) => {
                    return(
                        <p 
                        key={index} 
                        className="question"
                        onClick={() => {

                            setShowAnswer({
                                opacity: "1",
                                text: item.answer
                            });


                            if(item.continue === true) {
                                setShowQuestion({
                                    ...showQuestion,
                                    questions: item.next.map((e, i) => questionSet.filter((el) => el.index === e))[0]
                                })
                            } else {
                                setShowQuestion({
                                    opacity: "0",
                                    questions: []
                                })
                            }
                        }}
                        >{item.question}</p>
                    )
                })}
            </div>


            <div
            style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
                gap: "5px",
                zIndex: "10",
                top: "50%",
                left: "10%",
                transform: "translate(50px, 0)",
                background: "white",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                opacity: showAnswer.opacity
            }}
            >
                <p className="answer">{showAnswer.text}</p>
            </div>



        </div>
    );
}
