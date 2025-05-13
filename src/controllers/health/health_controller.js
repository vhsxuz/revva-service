import SuccessMessages from "#src/enum/success_message"
import SuccessStatus from "#src/enum/success_status"

export const getHealthStatus = async (req, res, next) => {
  return res.status(200).send({
    code: 200,
    status: SuccessStatus.SUCCESS_CONNECT,
    message: SuccessMessages.SUCCESS_CONNECT,
    data: []
  })
}
