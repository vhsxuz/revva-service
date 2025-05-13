import SuccessMessages from "#src/enum/success_message";
import SuccessStatus from "#src/enum/success_status";
import prismaClient from "#src/db/prisma";
import { faker } from '@faker-js/faker';

export const getUserByFirebaseCreds = async (req, res, next) => {
  try {
    // Using params is appropriate for resource identification
    const { firebase_uid } = req.params;

    if (!firebase_uid) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Firebase UID is required'
      });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        firebase_uid: firebase_uid
      }
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'User not found'
      });
    }

    return res.status(SuccessStatus.SUCCESS).json({
      code: SuccessStatus.SUCCESS,
      status: SuccessStatus.SUCCESS_CONNECT,
      message: SuccessMessages.SUCCESS_CONNECT,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

export const getPeopleIReferred = async (req, res, next) => {
  try {
    const { referrer_id } = req.params; // Your user ID

    if (!referrer_id) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Referrer ID is required'
      });
    }

    const referrals = await prismaClient.referral.findMany({
      where: { 
        referrerId: referrer_id 
      },
      include: {
        referredUser: {
          select: {
            id: true,
            name: true,
            email: true,
            created_at: true,
            // Include any other relevant user info
          }
        }
      },
      orderBy: {
        created_at: 'desc' // Show newest referrals first
      }
    });

    // Format the response
    const referredPeople = referrals.map(ref => ({
      referralId: ref.id,
      referralDate: ref.created_at,
      rewardPoints: ref.rewardPoints,
      user: ref.referredUser
    }));

    return res.status(200).json({
      code: 200,
      status: 'success',
      message: 'List of people you referred',
      data: referredPeople,
      count: referredPeople.length,
      totalRewardPoints: referrals.reduce((sum, ref) => sum + ref.rewardPoints, 0)
    });

  } catch (error) {
    next(error);
  }
};

export const register = async(req, res, next) => {
  const { firebase_uid, name, email } = req.body;
  try {
    const referralCode = faker.string.alphanumeric(6);

    const newUserData = {
      firebase_uid,
      name,
      email,
      role: 'staff',
      referral_code: referralCode
    };

    const newUser = await prismaClient.user.create({
      data: newUserData
    });

    return res.status(200).json({
      code: 200,
      status: SuccessStatus.SUCCESS_CREATE,
      message: 'Successfully registered user',
      data: newUser,
    });
    
  } catch (error) {
    next(error)
  }
}