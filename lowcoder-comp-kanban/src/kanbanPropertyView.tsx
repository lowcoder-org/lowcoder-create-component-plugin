import { trans } from "./i18n/comps";
import {
  Section,
} from "lowcoder-sdk";
import { KanbanImplComp } from "./KabanComp";

type Props = {
  comp: InstanceType<typeof KanbanImplComp>;
};

export function KanbanPropertyView(props: Props) {
  const { comp } = props;
  const children = comp.children;
  return (
    <>
      <Section name="Basic">
        {children.data.propertyView({})}
        {/* {children.data.propertyView({ label: "Data" })} */}
        {children.cardView.getPropertyView()}
      </Section>
      <Section name="Interaction">
        {children.onEvent.propertyView()}
      </Section>
      <Section name="Styles">
        {children.autoHeight.getPropertyView()}
        {!children.autoHeight.getView() &&
          children.scrollbars.propertyView({
            label: trans("prop.scrollbar"),
          })}
      </Section>
      <Section name="Card Header Styling">
        {children.cardHeaderStyles.getPropertyView()}
      </Section>
      <Section name="Card Styling">
        {children.cardContentStyles.getPropertyView()}
      </Section>
      <Section name="Tag Styles">
        {children.tagStyles.getPropertyView()}
      </Section>
      <Section name="Board Styles">
        {children.boardStyles.getPropertyView()}
      </Section>

    </>
  );
}
