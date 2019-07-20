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

import { Master } from "./Master";
import { MasterDetail } from "./MasterDetail";
import { MasterGroup } from "./MasterGroup";
import { MasterHeader } from "./MasterHeader";
import { MasterHeading } from "./MasterHeading";
import { MasterSearchBox } from "./MasterSearchBox";
import { MasterList } from "./MasterList";
import { MasterItem } from "./MasterItem";
import { Detail } from "./Detail";

export {
  MasterDetail,
  Master,
  MasterGroup,
  MasterHeader,
  MasterHeading,
  MasterSearchBox,
  MasterList,
  MasterItem,
  Detail
};
