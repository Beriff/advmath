import { Int } from './am_types'

interface ISerializable {
    Serialize(): string;
}

interface IVersion {
    GetVersion(): Version;
}

interface IClonable<Self> {
    Copy(): Self;
}

class Version {
    public Major: Int;
    public Minor: Int;
    public Patch: Int;
    private constructor(major: Int, minor: Int, patch: Int) {
        this.Major = major;
        this.Minor = minor;
        this.Patch = patch;
    }
    public static NewNum(maj: number, min: number, pat: number): Version {
        return new Version(new Int(maj), new Int(min), new Int(pat));
    }
    public static Major(): Version {
        return Version.NewNum(1, 0, 0);
    }
    public static Minor(): Version {
        return Version.NewNum(0, 1, 0);
    }
    public static Patch(): Version {
        return Version.NewNum(0, 0, 1);
    }
    public ToString(): string {
        return this.Major.ToString() + "." + this.Minor.ToString() + "." + this.Patch.ToString(); 
    }
    public CompareTo(other: Version): number {
        if (this.Major.IsEqual(other.Major)) {
            if (this.Minor.IsEqual(other.Minor)) {
                if (this.Patch.IsEqual(other.Patch)) {
                    return 0;
                } else if (this.Patch.GreaterThan(other.Patch)) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (this.Major.GreaterThan(other.Major)) {
                return 1;
            } else {
                return -1;
            }
        } else if (this.Major.GreaterThan(other.Major)) {
            return 1;
        } else {
            return -1;
        }
    }
    public TryParse(str: string): Version | null {
        let strarr: string[] = str.split('.')
        if (strarr.length == 3) {
            try {
                let major: Int = new Int(Number.parseInt(strarr[0]));
                let minor: Int = new Int(Number.parseInt(strarr[1]));
                let patch: Int = new Int(Number.parseInt(strarr[2]));
                return new Version(major, minor, patch);
            } catch {
                return null;
            }
        }
        return null;
    }
}

const ADVMATH_VERSION: Version = Version.NewNum(1, 0, 0);

export { Version, ADVMATH_VERSION, IClonable, ISerializable, IVersion }