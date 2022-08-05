let pi = Math.PI;
let scale = 3;
let size = 10*scale;
let body = size*6;
let arm = size*3.5;
let leg = size*4;
let neck = size*3;
let head = size*2;

function updateRigSettings(man){
    let rot = 1 - speed;
    let rig = {
        parts: {
            body: {
                color: colors[1],
                len: body,
                ang: man ? man.parts.body.ang : -pi / 2,
                // keys : [
                //     {len : body, ang : -pi/2, time : 0*speed},
                //     {len : body, ang : -pi/2, time : 1*speed},
                //     {len : body, ang : -pi/2, time : 2*speed},
                //     {len : body, ang : -pi/2, time : 3*speed},
                //     {len : body, ang : -pi/2, time : 4*speed},
                // ],          
                parts: {
                    right_arm: {
                        color: colors[3],
                        len: arm,
                        ang: man ? man.parts.body.parts.right_arm.ang : pi * (9 / 8), // 1/8th is 22.5 deg
                        keys : [
                            // Start
                            {len : leg, ang : pi - (pi * (2 / 8) * rot), time : 0 * speed},
                            // Middle
                            {len : leg, ang : pi, time : 1*speed},
                            // End
                            {len : leg, ang : pi + (pi * (2 / 8) * rot), time : 2 * speed},
                            // Middle
                            {len : leg, ang : pi, time : 3*speed},
                            // Start
                            {len : leg, ang : pi - (pi * (2 / 8) * rot), time : 4 * speed},
                        ],
                        parts : {
                            right_fore_arm : {
                                color: colors[3],
                                len: arm,
                                ang: man ? man.parts.body.parts.right_arm.parts.right_fore_arm.ang : pi * (7 / 8), // 1/8th is 22.5 deg
                                keys : [
                                    {len : arm, ang : (-pi * (4 / 8) * rot), time : 0*speed},
                                    {len : arm, ang : (-pi * (3 / 8) * rot), time : 1*speed},
                                    {len : arm, ang : (-pi * (1 / 8) * rot), time : 2*speed},
                                    {len : arm, ang : (-pi * (3 / 8) * rot), time : 3*speed},
                                    {len : arm, ang : (-pi * (4 / 8) * rot), time : 4*speed},
                                ],
                            }
                        }
                    },
                    left_arm: {
                        color: colors[2],
                        len: arm,
                        ang: man ? man.parts.body.parts.left_arm.ang : pi * (7 / 8), // 1/8th is 22.5 deg
                        keys : [
                            {len : leg, ang : pi + (pi * (2 / 8) * rot), time : 0 * speed},
                            {len : leg, ang : pi, time : 1*speed},
                            {len : leg, ang : pi - (pi * (2 / 8) * rot), time : 2 * speed},
                            {len : leg, ang : pi, time : 3*speed},
                            {len : leg, ang : pi + (pi * (2 / 8) * rot), time : 4 * speed},
                        ],
                        parts : {
                            left_fore_arm : {
                                color: colors[2],
                                len: arm,
                                ang: man ? man.parts.body.parts.left_arm.parts.left_fore_arm.ang : pi * (7 / 8), // 1/8th is 22.5 deg
                                keys : [
                                    {len : arm, ang : (-pi * (1 / 8) * rot), time : 0*speed},
                                    {len : arm, ang : (-pi * (2 / 8) * rot), time : 1*speed},
                                    {len : arm, ang : (-pi * (4 / 8) * rot), time : 2*speed},
                                    {len : arm, ang : (-pi * (2 / 8) * rot), time : 3*speed},
                                    {len : arm, ang : (-pi * (1 / 8) * rot), time : 4*speed},
                                ],
                            }
                        }
                    },
                    neck: {
                        color: colors[0],
                        len: neck,
                        ang: 0,
                        parts: {
                        head: {
                            color: colors[0],
                            size: head,
                        }
                    }
                    }
                }
            },
            right_leg: {
                color: colors[4],
                len: leg,
                ang: man ? man.parts.right_leg.ang : pi * (4 / 8), // 1/8th is 22.5 deg
                keys : [
                    {len : leg, ang : pi - pi/2 + (pi * (2 / 8) * rot), time : 0*speed},
                    {len : leg, ang : pi - pi/2, time : 1*speed},
                    {len : leg, ang : pi - pi/2 - (pi * (3 / 8) * rot), time : 2*speed},
                    {len : leg, ang : pi - pi/2, time : 3*speed},
                    {len : leg, ang : pi - pi/2 + (pi * (2 / 8) * rot), time : 4*speed},
                ],
                parts : {
                    right_lower_leg : {
                        color: colors[4],
                        len: leg,
                        ang: man ? man.parts.right_leg.parts.right_lower_leg.ang : pi * (7 / 8), // 1/8th is 22.5 deg
                        keys : [
                            {len : leg, ang : pi * (1 / 8) * rot, time : 0*speed},
                            {len : leg, ang : 0, time : 1*speed},
                            {len : leg, ang : pi * (2 / 8) * rot, time : 2*speed},
                            {len : leg, ang : 0, time : 3*speed},
                            {len : leg, ang : pi * (1 / 8) * rot, time : 4*speed},
                        ],
                    }
                }
            },
            left_leg: {
                color: colors[5],
                len: leg,
                ang: man ? man.parts.left_leg.ang : pi * (3 / 8), // 1/8th is 22.5 deg
                keys : [
                    {len : leg, ang : pi - pi/2 - (pi * (3 / 8) * rot), time : 0*speed},
                    {len : leg, ang : pi - pi/2, time : 1*speed},
                    {len : leg, ang : pi - pi/2 + (pi * (2 / 8) * rot), time : 2*speed},
                    {len : leg, ang : pi - pi/2, time : 3*speed},
                    {len : leg, ang : pi - pi/2 - (pi * (3 / 8) * rot), time : 4*speed},
                ],
                parts : {
                    left_lower_leg : {
                        color: colors[5],
                        len: leg,
                        ang: man ? man.parts.left_leg.parts.left_lower_leg.ang : pi * (7 / 8), // 1/8th is 22.5 deg
                        keys : [
                            {len : leg, ang : pi * (2 / 8) * rot, time : 0*speed},
                            {len : leg, ang : 0, time : 1*speed},
                            {len : leg, ang : pi * (1 / 8) * rot, time : 2*speed},
                            {len : leg, ang : 0, time : 3*speed},
                            {len : leg, ang : pi * (2 / 8) * rot, time : 4*speed},
                        ],
                    }
                }
            }
        }
    };
    return rig;
}