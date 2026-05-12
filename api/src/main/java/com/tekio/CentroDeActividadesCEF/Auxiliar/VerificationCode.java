package com.tekio.CentroDeActividadesCEF.Auxiliar;

import java.security.SecureRandom;

public class VerificationCode {

    private static final SecureRandom RNG = new SecureRandom();

    private static final char[] ALPHABET =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();

    private static String generate(int length) {
        if (length <= 0) throw new IllegalArgumentException("length must be > 0");

        char[] out = new char[length];
        for (int i = 0; i < length; i++) {
            out[i] = ALPHABET[RNG.nextInt(ALPHABET.length)];
        }
        return new String(out);
    }

    public static String generarCodigoCorreo() {
        return generate(6);
    }

}
