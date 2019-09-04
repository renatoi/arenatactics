/* Usage:
<MasterDetail>
  <Master>
    <MasterGroup>
      <MasterHeader>
        <MasterSearchBox />
      </MasterHeader>
      <MasterList>
        <MasterItem />
        <MasterItem />
      </MasterList>
    </MasterGroup>
    <MasterGroup>
      <MasterHeader>
        <MasterSearchBox />
      </MasterHeader>
      <MasterList>
        <MasterItem />
        <MasterItem />
      </MasterList>
    </MasterGroup>
  </Master>
  <Detail>...</Detail>
</MasterDetail>
*/

import { Detail } from "./Detail";
import { Master } from "./Master";
import { MasterDetail } from "./MasterDetail";
import { MasterFilterBox } from "./MasterFilterBox";
import { MasterGroup } from "./MasterGroup";
import { MasterHeader } from "./MasterHeader";
import { MasterHeading } from "./MasterHeading";
import { MasterItem } from "./MasterItem";
import { MasterList } from "./MasterList";
import { MasterSearchBox } from "./MasterSearchBox";

export {
  MasterDetail,
  Master,
  MasterGroup,
  MasterHeader,
  MasterHeading,
  MasterSearchBox,
  MasterFilterBox,
  MasterList,
  MasterItem,
  Detail
};
