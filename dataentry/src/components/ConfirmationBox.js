import {
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
} from "@dhis2/ui";

// Shows a Confirmation Box with props.children as text
// Takes in action to do on confirm as prop
export default function ConfirmationBox(props) {
  return (
    <Modal
      centered
      position="middle"
      hide={props.hide}
      onClose={props.hideConfirm}
    >
      <ModalTitle>Confirmation</ModalTitle>
      <ModalContent>{props.children}</ModalContent>

      <ModalActions>
        <ButtonStrip end>
          <Button onClick={props.hideConfirm} secondary>
            Cancel
          </Button>

          <Button
            onClick={() => {
              props.onSubmit();
              props.hideConfirm();
            }}
            primary
          >
            Submit
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
