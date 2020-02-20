/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useEffect, useState, useRef, useCallback } from "react";

const viewboxStyle = (viewBoxHeight: string) => css`
  width: 300px;
  height: ${viewBoxHeight};
  border: 1px solid black;
  overflow: scroll;
`;

interface ContentProps {
  itemCount: number;
  itemHeight: string;
}
const contentStyle = ({ itemCount, itemHeight }: ContentProps) => css`
  height: calc(${itemHeight} * ${itemCount});
  width: 100%;
  font-size: 16px;
  background-image: linear-gradient(skyblue, yellow);
  position: relative;
`;

interface ItemProps {
  itemHeight: string;
  index: number;
}
const itemStyle = ({ itemHeight, index }: ItemProps) => css`
  display: flex;
  align-items: center;
  height: ${itemHeight};
  position: absolute;
  width: 100%;
  top: calc(${itemHeight} * ${index});
  border-bottom: 1px solid black;
`;

const datalist = [...Array(50000)] as [];

export default function App() {
  const [currentItemList, setCurrentItemList] = useState([{}]);
  const [firstItem, setFirstItem] = useState(0);
  const viewboxRef = useRef<HTMLDivElement>(null);
  const itemCount = datalist.length;
  const itemHeight = "50px";
  const itemHeightTemp = 50;
  const viewBoxHeight = "400px";

  const onScroll = useCallback(() => {
    const scrollTop = viewboxRef.current ? viewboxRef.current.scrollTop : 0;
    const ceilItem = Math.ceil(scrollTop / itemHeightTemp);
    if (firstItem !== ceilItem) {
      setFirstItem(ceilItem);
    }
  }, [firstItem]);

  const setItemList = useCallback(() => {
    const result = datalist.reduce(
      (pv, cv, index) => {
        if (index >= firstItem - 3 && index <= firstItem + 10) {
          return [...pv, { key: index, value: cv }];
        }
        return pv;
      },
      [] as any
    );
    setCurrentItemList(result);
  }, [firstItem]);

  useEffect(() => {
    const viewboxDiv = viewboxRef.current || null;
    setItemList();
    if (viewboxDiv) {
      viewboxDiv.addEventListener("scroll", onScroll);
    }
    return () => {
      if (viewboxDiv) {
        viewboxDiv.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll, setItemList]);
  return (
    <div>
      <div css={viewboxStyle(viewBoxHeight)} ref={viewboxRef}>
        <div css={contentStyle({ itemCount, itemHeight })}>
          {currentItemList.map((item: any) => (
            <div
              key={JSON.stringify(item)}
              css={itemStyle({ itemHeight, index: item.key })}
            >
              <span>테스트 #{item.key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
